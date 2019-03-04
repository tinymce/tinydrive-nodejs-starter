tinymce.init({
  selector: 'textarea',
  plugins: 'tinydrive code image link media',
  toolbar: 'insertfile | undo redo | link image media | code',
  height: 600,
  // Tiny Drive specific options for more details on what these does check https://www.tiny.cloud/docs/plugins/drive/
  tinydrive_token_provider: '/jwt',
  // tinydrive_upload_path: '/uploads',
  // tinydrive_max_image_dimension: 1024
});
