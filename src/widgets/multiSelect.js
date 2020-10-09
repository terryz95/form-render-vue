import { Select } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const onChange = value => ctx.listeners.change(p.name, value)
    const style = p.invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const { enum: enums, enumNames } = p.schema || {}
    const _value = p.value && Array.isArray(p.value) ? p.value : []
    return (
      <Select
        {...{ props: p.options }}
        style={{ width: '100%', ...style }}
        mode="multiple"
        disabled={p.disabled || p.readonly}
        value={_value}
        onChange={onChange}
      >
        {(enums || []).map((val, index) => (
          <Select.Option value={val} key={index}>
            <span domPropsInnerHTML={enumNames ? enumNames[index] : val} />
          </Select.Option>
        ))}
      </Select>
    )
  },
}
