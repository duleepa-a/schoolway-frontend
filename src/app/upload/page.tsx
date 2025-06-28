// 'use client';
// import { CldUploadWidget } from 'next-cloudinary';
// import { useState } from 'react';

// interface UploadImageProps {
//   onUploadSuccess: (url: string) => void; // Callback to pass the uploaded image URL
//   fieldName: string; // To identify which field (e.g., profilePhoto or businessLicense)
// }

// const UploadImage: React.FC<UploadImageProps> = ({ onUploadSuccess, fieldName }) => {
//   const [error, setError] = useState<string | null>(null);

//   return (
//     <CldUploadWidget
//       uploadPreset="SchoolWay" // Ensure this preset exists in Cloudinary
//       options={{
//         sources: ['local', 'google_drive'],
//         defaultSource: 'local',
//         styles: {
//           palette: {
//             window: '#FFFFFF',
//             windowBorder: '#90A0B3',
//             tabIcon: '#000000',
//             menuIcons: '#5A616A',
//             textDark: '#000000',
//             textLight: '#FFFFFF',
//             link: '#006CFF',
//             action: '#F6B105',
//             inactiveTabIcon: '#0E2F5A',
//             error: '#F44235',
//             inProgress: '#0078FF',
//             complete: '#20B832',
//             sourceBg: '#E4EBF1',
//           },
//           fonts: {
//             default: null,
//             "'Poppins', sans-serif": {
//               url: 'https://fonts.googleapis.com/css?family=Poppins',
//               active: true,
//             },
//           },
//         },
//       }}
//       onSuccess={(result: any) => {
//         if (result.info && result.info.secure_url) {
//           onUploadSuccess(result.info.secure_url); // Pass the URL to the parent component
//         }
//       }}
//       onError={(error: any) => {
//         setError('Upload failed. Please try again.');
//         console.error('Upload error:', error);
//       }}
//     >
//       {({ open }) => (
//         <div>
//           <button
//             type="button"
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             onClick={() => open()}
//           >
//             Upload {fieldName === 'profilePhoto' ? 'Profile Photo' : ' Image'}
//           </button>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </div>
//       )}
//     </CldUploadWidget>
//   );
// };

// export default UploadImage;