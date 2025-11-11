import { submissions } from '@wix/forms';
import httpClient from 'axios';
import { FileField } from '../../react';
import { FormValues } from '@wix/form-public';
import { isFormFileField } from '../../react/utils';

interface UseUploadImageProps {
  setError(newValue: string | null): void;
  formValues: FormValues;
}

const getFormFileFieldIds = (formValues: FormValues): string[] => {
  const ids = Object.entries(formValues)
    .map(([_, value]) => {
      if (!isFormFileField(value)) {
        return;
      }

      const fileIds = value.map((file: FileField) => file.fileId);

      return fileIds;
    })
    .flat();

  return ids;
};

export const useUploadImage = ({
  setError,
  formValues,
}: UseUploadImageProps) => {
  const fileFieldIds = getFormFileFieldIds(formValues);

  const getUploadUrl = async (
    formId: string,
    file: FileField,
  ): Promise<string | undefined> => {
    try {
      const { uploadUrl } = await submissions.getMediaUploadUrl(
        formId,
        file.displayName,
        file.fileType,
      );

      return uploadUrl;
    } catch {
      return;
    }
  };

  const uploadImage = async (
    file: FileField,
    uploadUrl: string,
  ): Promise<string | undefined> => {
    const fileResponse = await fetch(file.url);
    const blob = await fileResponse.blob();
    const params = {
      filename: file.displayName,
    };

    const headers = {
      'Content-Type': 'application/octet-stream',
    };

    const { data } = await httpClient.put(uploadUrl, blob, {
      headers,
      params,
    });

    if (!data) {
      return;
    }

    return data.file.url;
  };

  const handleFileFields = async (
    formId: string,
    files: FileField[],
  ): Promise<FileField[]> => {
    const newFileFields = await Promise.all(
      files.map(async (fileField) => {
        if (fileFieldIds.includes(fileField.fileId)) {
          return fileField;
        }

        const uploadUrl = await getUploadUrl(formId, fileField);
        if (uploadUrl === undefined) {
          setError('An error occured while uploading the file!');
          return fileField;
        }

        const newUrl = await uploadImage(fileField, uploadUrl);
        if (newUrl === undefined) {
          setError('An error occured while uploading the file!');
          return fileField;
        }

        const newFileField = {
          ...fileField,
          url: newUrl,
        };

        return newFileField;
      }),
    );

    return newFileFields;
  };

  return {
    handleFileFields,
  };
};
