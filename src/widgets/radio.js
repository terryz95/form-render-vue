import { Radio } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    const { change: onChange } = ctx.listeners
    const { enum: enums, enumNames } = p.schema || {}
    return (
      <Radio.Group
        disabled={p.disabled || p.readonly}
        value={p.value}
        onChange={onChange}
      >
        {(enums || [true, false]).map((val, index) => (
          <Radio value={val} key={index}>
            <span domPropsInnerHTML={enumNames ? enumNames[index] : val} />
          </Radio>
        ))}
      </Radio.Group>
    )
  },
}
