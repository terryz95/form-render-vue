import { isFunction, evaluateString } from '../base/utils'
import DescriptionList, { getDescription } from './descList'
import FoldIcon from './foldIcon'

// TODO sortable hoc
const DragHandle = {
  functional: true,
  render() {
    return <div class="fr-item-action-icon fr-move-icon">:::</div>
  },
}

const listItemHoc = ButtonComponent => ({
  props: {
    p: {
      type: Object,
      default: () => ({}),
    },
    name: [String, Number],
    fold: Number,
    item: [Object],
  },
  computed: {
    description() {
      return getDescription({
        schema: this.p.schema,
        value: this.p.value,
        index: this.name,
      })
    },
    hadValue() {
      return this.description && this.description[0] && this.description[0].text
    },
  },
  mounted() {
    if (this.hasValue && this.fold !== 0) {
      this.toggleFold()
    }
  },
  methods: {
    toggleFold() {
      this.$emit('toggleFoldItem', this.name)
    },
    handleDelete() {
      const value = [...this.p.value]
      value.splice(name, 1)
      this.$emit('change', this.p.name, value)
    },
  },
  render() {
    const descProps = { ...this.p, index: this.name }
    const { options = {}, readonly, formData, value: rootValue } = this.p
    const { foldable: canFold, hideIndex } = options
    let { hideDelete, itemButtons } = options
    // 判断 hideDelete 是不是函数，是的话将计算后的值赋回
    let _isFunction = isFunction(hideDelete)
    if (_isFunction) {
      // isFunction 返回为 true 则说明只可能为 string | Function
      if (typeof _isFunction === 'string') {
        hideDelete = evaluateString(_isFunction, formData, rootValue)
      } else if (typeof _isFunction === 'function') {
        hideDelete = _isFunction(formData, rootValue)
      }
    }

    // 只有当items为object时才做收起（fold）处理
    const isObj = this.p.schema.items && this.p.schema.items.type == 'object'
    let setClass =
      'fr-set ba b--black-10 hover-b--black-20 relative flex flex-column'
    if (canFold && this.fold) {
      setClass += ' pv12'
    } else if (this.p.displayType === 'row') {
      setClass += ' pt44'
    }

    return (
      <li class={setClass}>
        {hideIndex ? null : (
          <div
            class="absolute top-0 left-0 bg-blue"
            style={{
              paddingLeft: 4,
              paddingRight: 6,
              borderBottomRightRadius: 8,
              borderTopLeftRadius: 3,
              backgroundColor: 'rgba(0, 0, 0, .36)',
              fontSize: 8,
              color: '#fff',
            }}
          >
            {name + 1}
          </div>
        )}

        {canFold && this.fold && isObj ? (
          <DescriptionList {...descProps} />
        ) : (
          this.item
        )}
        <div class="fr-item-actions">
          {canFold && (
            <FoldIcon
              fold={this.fold}
              onClick={this.toggleFold}
              class="fr-item-action-icon"
            />
          )}
          {!readonly && (
            <div class="fr-item-action-icon" onClick={this.handleDelete}>
              <img
                style={{ height: '70%' }}
                src="https://img.alicdn.com/tfs/TB12VseTuL2gK0jSZPhXXahvXXa-128-128.png"
                alt="delete"
              />
            </div>
          )}
          {!readonly && <DragHandle />}
        </div>
        {!((canFold && this.fold) || hideDelete || readonly) && (
          <div class="self-end flex mb2">
            {itemButtons &&
              itemButtons.length > 0 &&
              itemButtons.map((btn, idx) => {
                return (
                  <ButtonComponent
                    key={idx.toString()}
                    class="ml2"
                    type="dashed"
                    icon={btn.icon}
                    onClick={() => {
                      const value = [...this.p.value]
                      if (typeof window[btn.callback] === 'function') {
                        const result = window[btn.callback](value, name) // eslint-disable-line
                        this.$emit('change', this.p.name, result)
                      }
                    }}
                  >
                    {btn.text || ''}
                  </ButtonComponent>
                )
              })}
          </div>
        )}
      </li>
    )
  },
})

const fieldListHoc = ButtonComponent => {
  // TODO sortable hoc
  const ListItem = listItemHoc(ButtonComponent)
  return {
    functional: true,
    render(h, ctx) {
      const { p, foldList = [] } = ctx.props
      const {
        change: onChange,
        toggleFoldItem: onToggleFoldItem,
      } = ctx.listeners
      const { options, extraButtons } = p || {}
      // prefer ui:options/buttons to ui:extraButtons, but keep both for backwards compatibility
      const buttons = options.buttons || extraButtons || []
      const { readonly, schema = {} } = p
      const { maxItems } = schema
      const list = p.value || []
      if (!Array.isArray(list)) {
        console.error(`"${p.name}"这个字段相关的schema书写错误，请检查！`)
        return null
      }
      const canAdd = maxItems ? maxItems > list.length : true // 当到达最大个数，新增按钮消失
      const handleAddClick = () => {
        const { p, addUnfoldItem } = ctx.props
        const value = [...p.value]
        value.push(p.newItem)
        onChange(p.name, value)
        addUnfoldItem()
      }
      return (
        <ul class="pl0 ma0">
          {list.map((_, name) => (
            <ListItem
              key={`item-${name}`}
              index={name}
              name={name}
              p={p}
              fold={foldList[name]}
              onToggleFoldItem={onToggleFoldItem}
              item={p.getSubField({
                name,
                value: p.value[name],
                onChange(key, val) {
                  const value = [...p.value]
                  value[key] = val
                  p.onChange(p.name, value)
                },
              })}
            />
          ))}
          {!readonly && (
            <div class="tr mb2">
              {canAdd && (
                <ButtonComponent icon="add" onClick={handleAddClick}>
                  新增
                </ButtonComponent>
              )}
              {buttons &&
                buttons.length > 0 &&
                buttons.map((item, i) => {
                  const { icon, text, callback, ...rest } = item
                  return (
                    <ButtonComponent
                      class="ml2"
                      icon={icon}
                      key={i.toString()}
                      onClick={() => {
                        if (callback === 'clearAll') {
                          onChange(p.name, [])
                          return
                        }
                        if (callback === 'copyLast') {
                          const value = [...p.value]
                          const lastIndex = value.length - 1
                          value.push(
                            lastIndex > -1 ? value[lastIndex] : p.newItem
                          )
                          p.onChange(p.name, value)
                          return
                        }
                        if (typeof window[callback] === 'function') {
                          const value = [...p.value]
                          const _onChange = value => onChange(p.name, value)
                          window[callback](value, _onChange, schema, p.newItem) // eslint-disable-line
                        }
                      }}
                      {...{ props: rest }}
                    >
                      {text}
                    </ButtonComponent>
                  )
                })}
            </div>
          )}
        </ul>
      )
    },
  }
}

export default ButtonComponent => {
  // TODO sortable hoc
  const SortableList = fieldListHoc(ButtonComponent)
  return {
    inheritAttrs: false,
    data() {
      return {
        foldList:
          new Array((this.$attrs.value && this.$attrs.value.length) || 0).fill(
            false
          ) || [],
      }
    },
    methods: {
      addUnfoldItem() {
        this.foldList = [...this.foldList, 0]
      },
      toggleFoldItem(index) {
        this.$set(this.foldList, index, !this.foldList[index])
      },
      // handleSort = ({ oldIndex, newIndex }) => {
      //   const { onChange, name, value } = this.props;
      //   onChange(name, arrayMove(value, oldIndex, newIndex));
      //   this.setState({
      //     foldList: arrayMove(this.state.foldList, oldIndex, newIndex),
      //   });
      // };
    },
    render() {
      // hoc之后的组件，应该替换
      return (
        <SortableList
          p={this.$attrs}
          foldList={this.foldList}
          onToggleFoldItem={this.toggleFoldItem.bind(this, ...arguments)}
          addUnfoldItem={this.addUnfoldItem.bind(this)}
          distance={6}
          // useDragHandle
          helperClass="fr-sort-help-class"
          shouldCancelStart={e =>
            e.toElement && e.toElement.className === 'fr-tooltip-container'
          }
          // onSortEnd={this.handleSort}
        />
      )
    },
  }
}
