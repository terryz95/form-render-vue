import { Upload, Message, Button } from 'ant-design-vue'

export default {
  functional: true,
  render(h, ctx) {
    const { action, value, name, options = {} } = ctx.props
    const { change: onChange } = ctx.listeners
    const _action = action || (options && options.action)
    const _className = `fr-upload-file ${options ? options.className : ''}`
    const props = {
      name: 'file',
      action: _action,
      className: _className,
      onChange: info => {
        if (info.file.status === 'done') {
          Message.success(`${info.file.name} 上传成功`)
          onChange(name, info.file.response.url)
        } else if (info.file.status === 'error') {
          Message.error(`${info.file.name} 上传失败`)
        }
      },
      onRemove() {
        onChange(name, '')
      },
      ...options,
    }
    return (
      <div className="fr-upload-mod">
        <Upload {...{ props }}>
          <Button icon="upload">上传</Button>
        </Upload>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="fr-upload-preview"
          >
            已上传地址
          </a>
        )}
      </div>
    )
  },
}
