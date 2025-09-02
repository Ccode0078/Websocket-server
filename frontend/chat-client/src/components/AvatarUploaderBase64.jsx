// src/components/AvatarUploaderBase64.jsx
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

export default function AvatarUploaderBase64({ onPicked }) {
  const [files, setFiles] = useState([]);

  return (
    <div style={{ maxWidth: 360 }}>
      <FilePond
        files={files}
        onupdatefiles={(items) => {
          setFiles(items);
          const f = items[0];
          const dataUrl = f?.getFileEncodeDataURL?.();
          // send '' if cleared, so caller can clear avatar
          onPicked?.(dataUrl || "");
        }}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
        maxFileSize="400KB"
        allowFileEncode
        allowImageResize
        imageResizeTargetWidth={256}
        imageResizeTargetHeight={256}
        imageResizeMode="cover"
        imageTransformOutputQuality={0.82}
        imageTransformOutputMimeType="image/webp"
        labelIdle='Drop avatar or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}


