import { Input } from 'ant-design-vue'
import PreviewNode from '../components/previewNode'

export default {
  functional: true,
  components: {
    [Input.name]: Input,
    PreviewNode,
  },
  render(h, ctx) {
    const p = ctx.props
    const { options = {}, invalid, schema = {} } = p
    const style = invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const { format = 'text', maxLength } = schema
    const type = format === 'image' ? 'text' : format
    const handleChange = e => ctx.listeners.change(p.name, e.target.value)
    let suffix = undefined
    try {
      let _value = p.value || ''
      if (typeof _value === 'number') {
        _value = String(_value)
      }
      suffix = options.suffix
      if (!suffix && maxLength) {
        suffix = (
          <span
            style={
              _value.length > maxLength
                ? { fontSize: 12, color: '#ff4d4f' }
                : { fontSize: 12, color: '#999' }
            }
          >
            {_value.length + ' / ' + maxLength}
          </span>
        )
      }
    } catch (error) {
      // throw error
    }
    const config = {
      ...options,
      maxLength,
    }
    // 插槽
    let slots = {}
    if (options.addonAfter && typeof options.addonAfter !== 'string') {
      slots.addonAfter = () => options.addonAfter
    } else {
      if (format === 'image') {
        slots.addonAfter = () => <PreviewNode format={format} value={p.value} />
      }
    }
    if (options.addonBefore && typeof options.addonBefore !== 'string') {
      slots.addonBefore = () => options.addonBefore
    }
    if (typeof suffix !== 'string') {
      slots.suffix = () => options.suffix
    }
    if (typeof prefix !== 'string') {
      slots.prefix = () => options.prefix
    }
    return (
      <Input
        style={style}
        {...{ props: config }}
        value={p.value}
        type={type}
        disabled={p.disabled || p.readonly}
        onChange={handleChange}
        scopedSlots={slots}
      />
    )
  },
}
