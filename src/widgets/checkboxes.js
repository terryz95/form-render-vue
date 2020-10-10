import { Checkbox } from 'ant-design-vue'
export default {
  functional: true,
  components: {
    [Checkbox.name]: Checkbox,
    [Checkbox.Group.name]: Checkbox.Group,
  },
  render(h, ctx) {
    const p = ctx.props
    const { change: onChange } = ctx.listeners
    const { enum: enums, enumNames } = p.schema || {}
    const _value = p.value && Array.isArray(p.value) ? p.value : []
    return (
      <Checkbox.Group
        value={_value}
        disabled={p.disabled || p.readonly}
        onChange={values => onChange(p.name, values)}
      >
        {(enums || [true, false]).map((val, index) => (
          <Checkbox value={val} key={index}>
            <span domPropsInnerHTML={enumNames ? enumNames[index] : val} />
          </Checkbox>
        ))}
      </Checkbox.Group>
    )
  },
}
