import React from "react";
import type { ServiceAPI } from "@wix/services-definitions";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  FileUploadServiceDefinition,
  FileUploadService,
  type UploadState,
} from "../services/index.js";
import { FileUploadServiceConfig } from "../services/file-upload-service.js";
import { createServicesMap } from "@wix/services-manager";

export interface RootProps {
  children: React.ReactNode;
  fileUploadServiceConfig: FileUploadServiceConfig;
}


/**
 * Root component that provides the FileUpload service context to its children.
 * This component sets up the necessary services for managing file upload functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function FileUploadForm() {
 *   const uploadAction = async (file: File) => {
 *     // Your upload implementation
 *     return { url: 'uploaded-file-url' };
 *   };
 *
 *   return (
 *     <FileUpload.Root fileUploadServiceConfig={{
 *       maxFileSize: 10 * 1024 * 1024, // 10MB
 *       allowedTypes: ['image/*'],
 *       allowedExtensions: ['.jpg', '.png', '.gif'],
 *       uploadAction,
 *       onUploadSuccess: (result) => console.log('Upload success:', result),
 *       onUploadError: (error) => console.error('Upload error:', error)
 *     }}>
 *       <div>
 *         <FileUpload.FileSelector>
 *           {({ selectedFile, selectFile, clearFile, handleFileSelect }) => (
 *             <div>
 *               <input
 *                 type="file"
 *                 onChange={handleFileSelect}
 *                 accept="image/*"
 *               />
 *               {selectedFile && (
 *                 <p>Selected: {selectedFile.name}</p>
 *               )}
 *             </div>
 *           )}
 *         </FileUpload.FileSelector>
 *       </div>
 *     </FileUpload.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FileUploadServiceDefinition,
        FileUploadService,
        props.fileUploadServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for FileSelector headless component
 */
export interface FileSelectorProps {
  /** Render prop function that receives file selection data */
  children: (props: FileSelectorRenderProps) => React.ReactNode;
}

/**
 * Render props for FileSelector component
 */
export interface FileSelectorRenderProps {
  /** Currently selected file */
  selectedFile: File | null;
  /** Preview URL for the selected file (if supported) */
  previewUrl: string | null;
  /** Whether drag over is active */
  dragOver: boolean;
  /** Function to programmatically select a file */
  selectFile: (file: File) => void;
  /** Function to clear the selected file */
  clearFile: () => void;
  /** Function to handle drag over events */
  handleDragOver: (event: React.DragEvent) => void;
  /** Function to handle drag leave events */
  handleDragLeave: (event: React.DragEvent) => void;
  /** Function to handle drop events */
  handleDrop: (event: React.DragEvent) => void;
  /** Function to handle file input change events */
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Whether the selected file can be previewed */
  canPreview: boolean;
}

/**
 * FileSelector - Handles file selection via drag & drop or file input
 *
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function FileDropZone() {
 *   return (
 *     <FileUpload.FileSelector>
 *       {({ dragOver, handleDragOver, handleDragLeave, handleDrop, handleFileSelect, selectedFile, clearFile }) => (
 *         <div
 *           className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
 *           onDragOver={handleDragOver}
 *           onDragLeave={handleDragLeave}
 *           onDrop={handleDrop}
 *         >
 *           {selectedFile ? (
 *             <div>
 *               Selected: {selectedFile.name}
 *               <button onClick={clearFile}>Remove</button>
 *             </div>
 *           ) : (
 *             <div>
 *               <p>Drag & drop a file here, or click to select</p>
 *               <input
 *                 type="file"
 *                 onChange={handleFileSelect}
 *                 style={{ display: 'none' }}
 *                 id="file-input"
 *               />
 *               <label htmlFor="file-input">Choose File</label>
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </FileUpload.FileSelector>
 *   );
 * }
 * ```
 */
export const FileSelector = (props: FileSelectorProps) => {
  const service = useService(FileUploadServiceDefinition) as ServiceAPI<
    typeof FileUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const previewUrl = service.previewUrl.get();
  const dragOver = service.dragOver.get();

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    service.setDragOver(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      service.selectFile(files[0]!);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      service.selectFile(files[0]!);
    }
  };

  const canPreview = selectedFile ? service.canPreview(selectedFile) : false;

  return props.children({
    selectedFile,
    previewUrl,
    dragOver,
    selectFile: service.selectFile,
    clearFile: service.clearFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    canPreview,
  });
};

/**
 * Props for UploadProgress headless component
 */
export interface UploadProgressProps {
  /** Render prop function that receives upload progress data */
  children: (props: UploadProgressRenderProps) => React.ReactNode;
}

/**
 * Render props for UploadProgress component
 */
export interface UploadProgressRenderProps {
  /** Current upload state */
  uploadState: UploadState;
  /** Whether upload is currently in progress */
  isLoading: boolean;
  /** Whether upload completed successfully */
  isSuccess: boolean;
  /** Whether upload failed */
  isError: boolean;
  /** Whether there's an error */
  hasError: boolean;
  /** Whether there's a status message */
  hasMessage: boolean;
}

/**
 * UploadProgress - Shows upload status and progress
 *
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function UploadStatusIndicator() {
 *   return (
 *     <FileUpload.UploadProgress>
 *       {({ uploadState, isLoading, isSuccess, isError, hasMessage }) => (
 *         <div className="upload-status">
 *           {isLoading && (
 *             <div className="loading">
 *               <div className="spinner" />
 *               Uploading...
 *             </div>
 *           )}
 *           {isSuccess && (
 *             <div className="success">
 *               ✅ Upload completed successfully!
 *             </div>
 *           )}
 *           {isError && (
 *             <div className="error">
 *               ❌ Upload failed
 *               {hasMessage && <p>{uploadState.message}</p>}
 *             </div>
 *           )}
 *         </div>
 *       )}
 *     </FileUpload.UploadProgress>
 *   );
 * }
 * ```
 */
export const UploadProgress = (props: UploadProgressProps) => {
  const service = useService(FileUploadServiceDefinition) as ServiceAPI<
    typeof FileUploadServiceDefinition
  >;

  const uploadState = service.uploadState.get();

  return props.children({
    uploadState,
    isLoading: uploadState.type === "loading",
    isSuccess: uploadState.type === "success",
    isError: uploadState.type === "error",
    hasError: uploadState.type === "error",
    hasMessage: uploadState.message !== "",
  });
};

/**
 * Props for UploadTrigger headless component
 */
export interface UploadTriggerProps {
  /** Render prop function that receives upload trigger data */
  children: (props: UploadTriggerRenderProps) => React.ReactNode;
}

/**
 * Render props for UploadTrigger component
 */
export interface UploadTriggerRenderProps {
  /** Function to trigger file upload */
  uploadFile: () => Promise<void>;
  /** Whether upload can be triggered */
  canUpload: boolean;
  /** Whether upload is currently in progress */
  isUploading: boolean;
}

/**
 * UploadTrigger - Handles file upload action
 *
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function UploadButton() {
 *   return (
 *     <FileUpload.UploadTrigger>
 *       {({ uploadFile, canUpload, isUploading }) => (
 *         <button
 *           onClick={uploadFile}
 *           disabled={!canUpload}
 *           className="upload-btn"
 *         >
 *           {isUploading ? 'Uploading...' : 'Upload File'}
 *         </button>
 *       )}
 *     </FileUpload.UploadTrigger>
 *   );
 * }
 * ```
 */
export const UploadTrigger = (props: UploadTriggerProps) => {
  const service = useService(FileUploadServiceDefinition) as ServiceAPI<
    typeof FileUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const uploadState = service.uploadState.get();

  const canUpload = selectedFile !== null && uploadState.type !== "loading";
  const isUploading = uploadState.type === "loading";

  return props.children({
    uploadFile: service.uploadFile,
    canUpload,
    isUploading,
  });
};

/**
 * Props for FilePreview headless component
 */
export interface FilePreviewProps {
  /** Render prop function that receives file preview data */
  children: (props: FilePreviewRenderProps) => React.ReactNode;
}

/**
 * Render props for FilePreview component
 */
export interface FilePreviewRenderProps {
  /** Currently selected file */
  selectedFile: File | null;
  /** Preview URL for the file */
  previewUrl: string | null;
  /** Whether there's a preview available */
  hasPreview: boolean;
  /** Whether the file can be previewed */
  canPreview: boolean;
  /** File name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** Formatted file size string */
  formattedFileSize: string;
  /** File type */
  fileType: string;
}

/**
 * FilePreview - Displays preview information for the selected file
 *
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function FilePreviewCard() {
 *   return (
 *     <FileUpload.FilePreview>
 *       {({ selectedFile, previewUrl, hasPreview, canPreview, fileName, formattedFileSize, fileType }) => (
 *         selectedFile && (
 *           <div className="file-preview">
 *             <div className="file-info">
 *               <h3>{fileName}</h3>
 *               <p>Size: {formattedFileSize}</p>
 *               <p>Type: {fileType}</p>
 *             </div>
 *             {canPreview && hasPreview && (
 *               <div className="preview">
 *                 <img src={previewUrl} alt="File preview" />
 *               </div>
 *             )}
 *           </div>
 *         )
 *       )}
 *     </FileUpload.FilePreview>
 *   );
 * }
 * ```
 */
export const FilePreview = (props: FilePreviewProps) => {
  const service = useService(FileUploadServiceDefinition) as ServiceAPI<
    typeof FileUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const previewUrl = service.previewUrl.get();

  const canPreview = selectedFile ? service.canPreview(selectedFile) : false;
  const hasPreview = previewUrl !== null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return props.children({
    selectedFile,
    previewUrl,
    hasPreview,
    canPreview,
    fileName: selectedFile?.name || "",
    fileSize: selectedFile?.size || 0,
    formattedFileSize: selectedFile ? formatFileSize(selectedFile.size) : "",
    fileType: selectedFile?.type || "",
  });
};

/**
 * Props for ValidationStatus headless component
 */
export interface ValidationStatusProps {
  /** File to validate (optional, uses selected file if not provided) */
  file?: File;
  /** Render prop function that receives validation data */
  children: (props: ValidationStatusRenderProps) => React.ReactNode;
}

/**
 * Render props for ValidationStatus component
 */
export interface ValidationStatusRenderProps {
  /** Whether the file is valid */
  isValid: boolean;
  /** Validation error message if any */
  error: string | undefined;
  /** Validation rules that apply */
  validationRules: {
    maxFileSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  };
}

/**
 * ValidationStatus - Shows file validation status and rules
 *
 * @component
 * @example
 * ```tsx
 * import { FileUpload } from '@wix/media/components';
 *
 * function FileValidationMessage() {
 *   return (
 *     <FileUpload.ValidationStatus>
 *       {({ isValid, error, validationRules }) => (
 *         <div className="validation-status">
 *           {!isValid && error && (
 *             <div className="error-message">
 *               ⚠️ {error}
 *             </div>
 *           )}
 *           <div className="rules">
 *             <h4>Upload Requirements:</h4>
 *             {validationRules.maxFileSize && (
 *               <p>Max size: {validationRules.maxFileSize / 1024 / 1024}MB</p>
 *             )}
 *             {validationRules.allowedTypes && (
 *               <p>Allowed types: {validationRules.allowedTypes.join(', ')}</p>
 *             )}
 *           </div>
 *         </div>
 *       )}
 *     </FileUpload.ValidationStatus>
 *   );
 * }
 * ```
 */
export const ValidationStatus = (props: ValidationStatusProps) => {
  const service = useService(FileUploadServiceDefinition) as ServiceAPI<
    typeof FileUploadServiceDefinition
  >;

  const selectedFile = service.selectedFile.get();
  const fileToValidate = props.file || selectedFile;

  const validationResult = fileToValidate
    ? service.validateFile(fileToValidate)
    : { isValid: true, error: undefined };

  return props.children({
    isValid: validationResult.isValid,
    error: validationResult.error,
    validationRules: service.validationRules,
  });
};
