import { Switch } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const { change: onChange } = ctx.listeners
    return (
      <Switch
        disabled={p.disabled || p.readonly}
        onChange={checked => onChange(p.name, checked)}
        checked={!!p.value}
      />
    )
  },
}
