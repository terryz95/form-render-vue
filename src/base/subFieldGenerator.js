import omit from 'lodash/omit'
const subFieldGenerator = ({
  fieldCanRedefine: can,
  Field: SourceField = null,
  props = {},
}) => args => ({
  functional: true,
  render() {
    const { name, Field: RedefineField = null, ...others } = args
    const Field = (can && RedefineField) || SourceField
    if (Field) {
      const fieldProps = omit(
        {
          ...props,
          name,
          ...others,
        },
        ['onChange']
      )
      const onChange = props.onChange || others.onChange
      return <Field {...{ attrs: fieldProps }} key={name} onChange={onChange} />
    }
    return null
  },
})

export default subFieldGenerator
