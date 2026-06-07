import { useState, KeyboardEvent } from 'react'
import { Property, PropertyStatus } from '@/types'
import { X } from 'lucide-react'

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void
  onCancel: () => void
  initial?: Partial<Property>
}

const PRESET_TAGS = ['近地铁', '精装修', '押一付一', '朝南', '有电梯', '拎包入住', '近商圈', '安静', '采光好', '新装修']

export default function PropertyForm({ onSubmit, onCancel, initial }: PropertyFormProps) {
  const [form, setForm] = useState({
    address: initial?.address || '',
    area: initial?.area || '',
    rent: initial?.rent || '',
    layout: initial?.layout || '',
    size: initial?.size || '',
    photos: initial?.photos || '',
    landlordName: initial?.landlordName || '',
    landlordPhone: initial?.landlordPhone || '',
    status: initial?.status || 'viewing' as PropertyStatus,
    notes: initial?.notes || '',
  })
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [tagInput, setTagInput] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const togglePresetTag = (tag: string) => {
    if (tags.includes(tag)) {
      removeTag(tag)
    } else {
      addTag(tag)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photos: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...form,
      rent: Number(form.rent),
      size: form.size ? Number(form.size) : undefined,
      tags,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{initial ? '编辑房源' : '新增房源'}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
          <input type="text" name="address" value={form.address} onChange={handleChange} required
            placeholder="如：朝阳区三里屯"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">区域</label>
          <input type="text" name="area" value={form.area} onChange={handleChange} required
            placeholder="如：朝阳区"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月租 (元)</label>
          <input type="number" name="rent" value={form.rent} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">户型</label>
          <input type="text" name="layout" value={form.layout} onChange={handleChange} required
            placeholder="如：两室一厅"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">面积 (㎡)</label>
          <input type="number" name="size" value={form.size} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="viewing">在看中</option>
            <option value="favorited">已收藏</option>
            <option value="signed">已签约</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">房东姓名</label>
          <input type="text" name="landlordName" value={form.landlordName} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">房东电话</label>
          <input type="text" name="landlordPhone" value={form.landlordPhone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">照片</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        {form.photos && (
          <img src={form.photos} alt="预览" className="mt-2 w-32 h-32 object-cover rounded-lg" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => togglePresetTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                tags.includes(tag)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="输入自定义标签，按回车添加"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            添加
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          取消
        </button>
        <button type="submit"
          className="px-4 py-2 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
          保存
        </button>
      </div>
    </form>
  )
}
