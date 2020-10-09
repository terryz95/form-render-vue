import { Input } from 'ant-design-vue'

const { TextArea } = Input

export default {
  render(h, ctx) {
    const p = ctx.props
    const onChange = e => ctx.listeners.change(p.name, e.target.value)
    const { options, invalid, schema = {} } = p
    const { maxLength } = schema
    const style = invalid
      ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' }
      : {}
    const defaultUi = { rows: 3 }
    const ui = { ...defaultUi, ...options }

    const _value = p.value || ''
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <TextArea
          style={style}
          disabled={p.disabled || p.readonly}
          value={p.value}
          {...{ props: ui }}
          onChange={onChange}
        />
        {maxLength ? (
          <span
            style={{
              fontSize: 12,
              position: 'absolute',
              bottom: 5,
              right: 11,
              color: _value.length > maxLength ? '#ff4d4f' : '#999',
            }}
          >
            {_value.length + ' / ' + maxLength}
          </span>
        ) : null}
      </div>
    )
  },
}
