import parse from '../base/parser'
export default {
  functional: true,
  render(h, ctx) {
    const { fields, ...settings } = ctx.props
    const { change: onChange } = ctx.listeners
    const { Field, props } = parse(settings, fields)
    if (!Field) {
      return null
    }
    return (
      <Field
        isRoot={true}
        {...{ attrs: props }}
        value={settings.data}
        formData={settings.formData}
        onChange={onChange}
      />
    )
  },
}
