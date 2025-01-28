import { ref } from 'vue';
import { base64ToFile } from '@/utils/generateImageByBase64';

interface FileListItem {
  id: string;
  name: string;
  status: string;
  url: string;
  thumbnailUrl: string;
  file: File;
}

export function useFileUpload() {
  const fileList = ref<FileListItem[]>([]);
  const previewUrl = ref<string>('');
  const showPreviewModal = ref(false);

  const initializeFromExisting = async (existingFile: string | File | null) => {
    if (!existingFile) {
      resetUpload();
      return null;
    }

    try {
      let file: File;
      let preview: string;
      
      if (existingFile instanceof File) {
        file = existingFile;
        preview = URL.createObjectURL(file);
      } else if (typeof existingFile === 'string') {
        const base64Data = existingFile.includes('base64')
          ? existingFile
          : `data:image/png;base64,${existingFile}`;
        file = base64ToFile(base64Data);
        preview = base64Data;
      } else {
        throw new Error('Invalid file format');
      }

      updateFileList(file, preview);
      return file;
    } catch (error) {
      console.error('Error initializing file:', error);
      resetUpload();
      return null;
    }
  };

  const updateFileList = (file: File, preview: string) => {
    fileList.value = [{
      id: 'current-file',
      name: file.name,
      status: 'finished',
      url: preview,
      thumbnailUrl: preview,
      file: file
    }];
    previewUrl.value = preview;
  };

  const handleFileChange = (file: File) => {
    if (!file) return null;
    const preview = URL.createObjectURL(file);
    updateFileList(file, preview);
    return file;
  };

  const resetUpload = () => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value);
    }
    fileList.value = [];
    previewUrl.value = '';
  };

  const showPreview = () => {
    showPreviewModal.value = true;
  };

  const hidePreview = () => {
    showPreviewModal.value = false;
  };

  return {
    fileList,
    previewUrl,
    showPreviewModal,
    initializeFromExisting,
    handleFileChange,
    resetUpload,
    showPreview,
    hidePreview
  };
}