import { Checkbox } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const { change: onChange } = ctx.listeners
    return (
      <Checkbox
        checked={p.value}
        disabled={p.disabled || p.readonly}
        onChange={e => onChange(p.name, e.target.checked)}
      />
    )
  },
}
