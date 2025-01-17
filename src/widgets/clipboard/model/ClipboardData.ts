import {WidgetData} from "@widget-js/core";
import {remove} from 'lodash'
import {nanoid} from 'nanoid'

type ClipboardType = 'text' | 'image'
//默认保留时长，单位分钟
const reservedTime = 12 * 60

export class ClipboardListData extends WidgetData {
  list: ClipboardData[] = [new ClipboardData('欢迎使用桌面组件'), new ClipboardData('鼠标右击组件弹出菜单')]

  deleteClipboardData(data: ClipboardData) {
    remove(this.list, function (item) {
      return item.id === data.id
    })
  }

  parseJSON(json: {}) {
    super.parseJSON(json)
    this.list = []
    const list = json['list']
    for (let todoJson of list) {
      this.list.push(Object.assign(new ClipboardData(''), todoJson))
    }
  }

  /**
   * 清除过期的剪贴板数据
   */
  removeExpired() {

  }
}

export class ClipboardData {
  content: string
  id: string
  type: ClipboardType = 'text'
  favorite: boolean = false
  createdAt: Date = new Date()
  shortContent?: string

  constructor(content: string, type?: ClipboardType) {
    this.content = content;
    this.type = type ?? 'text';
    this.id = nanoid()
    this.shortContent = content.substring(0, 50)
  }
}
