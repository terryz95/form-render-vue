import { Slider, InputNumber } from 'ant-design-vue'
export default {
  functional: true,
  render(h, ctx) {
    const p = ctx.props
    // const { change: onChange } = ctx.listeners
    const style = p.invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const { max, min, step } = p.schema
    let setting = {}
    if (max || max === 0) {
      setting = { max }
    }

    if (min || min === 0) {
      setting = { ...setting, min }
    }

    if (step) {
      setting = { ...setting, step }
    }

    const onChange = value => {
      ctx.listeners.change(p.name, value)
    }

    return (
      <div className="fr-slider">
        <Slider
          style={{ flexGrow: 1, marginRight: 12 }}
          {...{ props: setting }}
          value={typeof p.value === 'number' ? p.value : min || 0}
          disabled={p.disabled || p.readonly}
          onChange={onChange}
        />
        {p.readonly ? (
          <span style={{ width: '90px' }}>
            {p.value === (undefined || '') ? '-' : p.value}
          </span>
        ) : (
          <InputNumber
            {...{ props: { ...p.options, ...setting } }}
            style={{ width: '90px', ...style }}
            value={p.value}
            disabled={p.disabled}
            onChange={onChange}
          />
        )}
      </div>
    )
  },
}
