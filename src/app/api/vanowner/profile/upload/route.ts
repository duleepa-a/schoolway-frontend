import { IncomingForm } from 'formidable';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = new IncomingForm();

    const contentType = req.headers.get('content-type') || '';

    const contentLength = req.headers.get('content-length') || '';

    const buffer = Buffer.from(await req.arrayBuffer());

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fakeReq = Object.assign(stream, {
      headers: {
        'content-type': contentType,
        'content-length': contentLength,
      },
    });

    return new Promise((resolve) => {
      form.parse(fakeReq as any, async (err, fields, files) => {
        if (err) {
          console.error(err);
          resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 500 }));
          return;
        }

        const file = files.file;
        if (!file) {
          resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
          return;
        }

        // @ts-ignore
        const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;

        try {
          const cloudinary = (await import('@/lib/cloudinary')).default;

          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'profile_pics',
          });

          resolve(NextResponse.json({ url: result.secure_url }));
        } catch (uploadErr) {
          console.error(uploadErr);
          resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
        }
      });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
