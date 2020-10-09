<script>
import { widgets } from '../widgets'
const {
  checkbox: Checkbox,
  checkboxes: Checkboxes,
  date: Date,
  dateRange: DateRange,
  html: Html,
  input: Input,
  multiSelect: MultiSelect,
} = widgets
export default {
  name: 'HelloWorld',
  data() {
    return {
      checked: true,
      checkedList: [1, 3],
      date: '',
      dateRange: ['', ''],
      text: '',
      image: '',
      selections: [],
    }
  },
  watch: {
    checked(val) {
      console.log(val)
    },
    checkedList(val) {
      console.log(val)
    },
    date(val) {
      console.log(val)
    },
    dateRange(val) {
      console.log(val)
    },
  },
  methods: {
    handleChange(name, string) {
      this.image = string
    },
  },
  render() {
    return (
      <div>
        <div>
          <Checkbox
            name="test1"
            value={this.checked}
            onChange={(name, value) => (this.checked = value)}
          />
        </div>
        <div>
          <Checkboxes
            schema={{ enum: [1, 2, 3], enumNames: ['One', 'Two', 'Three'] }}
            value={this.checkedList}
            onChange={(name, values) => {
              this.checkedList = values
            }}
          />
        </div>
        <div>
          <Date
            value={this.date}
            schema={{
              format: 'time',
            }}
            options={{}}
            onChange={(name, value) => {
              this.date = value
            }}
          />
        </div>
        <div>
          <DateRange
            value={this.dateRange}
            schema={{
              format: 'dateTime',
            }}
            options={{
              placeholder: ['开始时间', '结束时间'],
            }}
            onChange={(name, string) => {
              this.dateRange = string
            }}
          />
        </div>
        <div>
          <Html value="静态文本" schema={{}} />
        </div>
        <div>
          <Input
            value={this.text}
            schema={{}}
            options={{
              suffix: 'RMB',
            }}
            onChange={(name, string) => {
              this.text = string
            }}
          />
        </div>
        <div>
          <Input
            value={this.image}
            schema={{ format: 'image' }}
            options={{}}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <MultiSelect
            value={this.selections}
            schema={{
              enum: ['A', 'B', 'C', 'D'],
              enumNames: ['杭州', '武汉', '湖州', '贵阳'],
            }}
            options={{}}
            onChange={(name, values) => {
              this.selections = values
            }}
          />
        </div>
      </div>
    )
  },
}
</script>
