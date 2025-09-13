'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'resume' | 'portfolio'
    const uploadedBy = formData.get('uploadedBy') as string; // 관리자 ID

    if (!file || !fileType || !uploadedBy) {
      return { success: false, error: '필수 필드가 누락되었습니다.' };
    }

    // 파일 타입 검증
    if (fileType !== 'resume' && fileType !== 'portfolio') {
      return { success: false, error: '잘못된 파일 타입입니다.' };
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: '파일 크기는 10MB를 초과할 수 없습니다.'
      };
    }

    // 파일 확장자 검증
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return { success: false, error: 'PDF 파일만 업로드 가능합니다.' };
    }

    // 기존 파일 삭제 (같은 타입의 파일이 있다면)
    const existingFile = await prisma.fileUpload.findFirst({
      where: { fileType: fileType },
      orderBy: { createdAt: 'desc' }
    });

    if (existingFile) {
      // Supabase Storage에서 기존 파일 삭제
      const existingFilePath = `uploads/${existingFile.fileType}/${existingFile.filename}`;
      const { error: deleteError } = await supabase.storage
        .from('files')
        .remove([existingFilePath]);

      if (deleteError) {
        console.error('기존 파일 삭제 오류:', deleteError);
        // 삭제 실패해도 계속 진행
      }

      // 데이터베이스에서 기존 파일 정보 삭제
      await prisma.fileUpload.delete({
        where: { id: existingFile.id }
      });
    }

    // 고유한 파일명 생성 (타임스탬프 + 랜덤)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const uniqueFilename = `${timestamp}-${random}${fileExtension}`;
    const filePath = `uploads/${fileType}/${uniqueFilename}`;

    // Supabase Storage에 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase 업로드 오류:', uploadError);
      return { success: false, error: '파일 업로드 중 오류가 발생했습니다.' };
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);

    // 데이터베이스에 파일 정보 저장
    const fileUpload = await prisma.fileUpload.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        fileType: fileType,
        fileSize: file.size,
        fileUrl: urlData.publicUrl,
        uploadedBy: uploadedBy
      }
    });

    return {
      success: true,
      data: fileUpload,
      message: `${
        fileType === 'resume' ? '이력서' : '포트폴리오'
      }가 성공적으로 업로드되었습니다.`
    };
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return {
      success: false,
      error: '파일 업로드 중 오류가 발생했습니다.'
    };
  }
}

export async function getFileUploads() {
  try {
    const files = await prisma.fileUpload.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: files };
  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    return {
      success: false,
      error: '파일 목록을 불러오는 중 오류가 발생했습니다.'
    };
  }
}

export async function deleteFile(fileId: string) {
  try {
    // 파일 정보 조회
    const file = await prisma.fileUpload.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return { success: false, error: '파일을 찾을 수 없습니다.' };
    }

    // Supabase Storage에서 파일 삭제
    const filePath = `uploads/${file.fileType}/${file.filename}`;
    const { error: deleteError } = await supabase.storage
      .from('files')
      .remove([filePath]);

    if (deleteError) {
      console.error('Supabase 삭제 오류:', deleteError);
      // 파일이 이미 삭제되었을 수도 있으므로 계속 진행
    }

    // 데이터베이스에서 파일 정보 삭제
    await prisma.fileUpload.delete({
      where: { id: fileId }
    });

    return {
      success: true,
      message: '파일이 성공적으로 삭제되었습니다.'
    };
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return {
      success: false,
      error: '파일 삭제 중 오류가 발생했습니다.'
    };
  }
}

export async function getActiveFiles() {
  try {
    const [resume, portfolio] = await Promise.all([
      prisma.fileUpload.findFirst({
        where: { fileType: 'resume' },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.fileUpload.findFirst({
        where: { fileType: 'portfolio' },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      success: true,
      data: {
        resume: resume?.fileUrl || null,
        portfolio: portfolio?.fileUrl || null
      }
    };
  } catch (error) {
    console.error('활성 파일 조회 오류:', error);
    return {
      success: false,
      error: '파일 정보를 불러오는 중 오류가 발생했습니다.'
    };
  }
}
