import FormRender from './index'
import { combineSchema } from '../base/utils'
export default {
  functional: true,
  render(h, ctx) {
    const {
      schema,
      propsSchema = {},
      uiSchema = {},
      readOnly,
      showValidate,
      ...rest
    } = ctx.props
    let _schema = {}
    const jsonSchema = schema || propsSchema // 兼容schema字段和propsSchema字段
    // 将uiSchema和schema合并（推荐不写uiSchema）
    _schema = combineSchema(jsonSchema, uiSchema)

    return (
      <FormRender
        readOnly={readOnly}
        showValidate={!readOnly && showValidate} // 预览模式下不展示校验
        {...{ props: rest }}
        schema={_schema}
      />
    )
  },
}
