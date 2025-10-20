// src/app/api/mobile/driver/session/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFirebaseDatabase, updateStudentStatus } from '@/lib/firebase-admin';

type ChildStatus = 'ON_VAN' | 'AT_SCHOOL' | 'AT_HOME' | 'NOT_ASSIGNED' | 'INACTIVE';


export async function POST(req: NextRequest) {
  try {
    const { sessionId, studentId, type, status , sessionType } = await req.json();

    // 🧩 Validate inputs
    if (!sessionId || !studentId || !type || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (sessionId, studentId, type, status)' },
        { status: 400 }
      );
    }

    const normalizedType = type.toUpperCase(); // "PICKUP" | "DROPOFF"
    const normalizedStatus = status.toUpperCase(); // "PICKED_UP" | "NOT_PRESENT" | "DROPPED_OFF"

    // 🗃️ Prepare update object
    const updateData: any = {};

    let updateChildStatus: ChildStatus = 'AT_HOME';
    
    if (normalizedType === 'PICKUP') {
      updateData.pickupStatus = normalizedStatus;
      updateData.pickedUpAt = normalizedStatus === 'PICKED_UP' ? new Date() : null;
    } else if (normalizedType === 'DROPOFF') {
      updateData.pickupStatus = normalizedStatus;
      updateData.droppedOffAt = normalizedStatus === 'DROPPED_OFF' ? new Date() : null;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid type (must be PICKUP or DROPOFF)' },
        { status: 400 }
      );
    }

    if(normalizedStatus === 'PICKED_UP'){
      updateChildStatus = 'ON_VAN';
    }
    else if(normalizedStatus === 'DROPPED_OFF' && sessionType === 'EVENING_DROPOFF'){
      updateChildStatus = 'AT_HOME';
    }
    else if(normalizedStatus === 'DROPPED_OFF' && sessionType === 'MORNING_PICKUP'){
      updateChildStatus = 'AT_SCHOOL';
    }

    if(updateChildStatus){
      await prisma.child.update({
        where: { id: studentId },
        data: { status: updateChildStatus },
      });
    }

    // 🧮 Update DB record in Prisma
    const updated = await prisma.sessionStudent.updateMany({
      where: {
        sessionId,
        childId: studentId,
      },
      data: updateData,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, message: 'Student not found for this session' },
        { status: 404 }
      );
    }

    // 🔥 Update Firebase Realtime DB
    const firebaseStatus =
      normalizedStatus === 'PICKED_UP'
        ? 'picked_up'
        : normalizedStatus === 'DROPPED_OFF'
        ? 'dropped_off'
        : 'pending';

    await updateStudentStatus(sessionId, studentId, firebaseStatus, Date.now());

    const db = getFirebaseDatabase();
    const snapshot = await db
      .ref(`active_sessions/${sessionId}/students/${studentId}`)
      .once('value');
    const updatedStudent = snapshot.val();

    // ✅ Success
    return NextResponse.json({
      success: true,
      message:
        normalizedType === 'PICKUP'
          ? `Student marked as ${normalizedStatus.toLowerCase()} for pickup`
          : `Student marked as ${normalizedStatus.toLowerCase()} for dropoff`,
      student: updatedStudent,
    });
  } catch (err) {
    console.error('❌ Error marking attendance:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
