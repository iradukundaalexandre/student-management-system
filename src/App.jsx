import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GraduationCap, Search, Plus, Users, UserRound, Trash2, Eye, X, Keyboard, ShieldCheck, BookOpen, CheckCircle2 } from 'lucide-react'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useThrottle from './hooks/useThrottle'

const starterStudents = [
  { id: 1, name: 'Aline Mukamana', email: 'aline@example.com', className: 'S4 Software Development', gender: 'Female', phone: '0788000001', address: 'Kigali', createdAt: '2026-11-01' },
  { id: 2, name: 'Jean Claude Niyonzima', email: 'jean@example.com', className: 'S5 Computer Science', gender: 'Male', phone: '0788000002', address: 'Huye', createdAt: '2026-11-02' },
  { id: 3, name: 'Diane Uwase', email: 'diane@example.com', className: 'S4 Software Development', gender: 'Female', phone: '0788000003', address: 'Musanze', createdAt: '2026-11-03' },
]

const emptyForm = { name: '', email: '', className: '', gender: '', phone: '', address: '' }

export default function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('sms-students')
      return saved ? JSON.parse(saved) : starterStudents
    } catch {
      return starterStudents
    }
  })
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [notice, setNotice] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('sms-students', JSON.stringify(students))
  }, [students])

  // Debouncing: search runs 350ms after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput.trim().toLowerCase()), 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  const focusSearch = useCallback(() => searchRef.current?.focus(), [])
  const closeDetails = useCallback(() => setSelectedStudent(null), [])
  useKeyboardShortcuts({ onSearch: focusSearch, onEscape: closeDetails })

  const filteredStudents = useMemo(() => students.filter(student => {
    const content = `${student.name} ${student.email} ${student.className} ${student.phone}`.toLowerCase()
    return content.includes(searchTerm)
  }), [students, searchTerm])

  function handleChange(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  function validateForm() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Student name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.className.trim()) nextErrors.className = 'Class is required.'
    if (!form.gender) nextErrors.gender = 'Select a gender.'
    if (form.phone && !/^[+0-9\s-]{7,18}$/.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function addStudent(event) {
    event.preventDefault()
    if (!validateForm()) return

    const student = {
      ...form,
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      className: form.className.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setStudents(current => [student, ...current])
    setForm(emptyForm)
    setErrors({})
    setNotice(`${student.name} was registered successfully.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  function deleteStudent(event, studentId) {
    // Stop the row click from opening details when the delete button is clicked.
    event.stopPropagation()
    const student = students.find(item => item.id === studentId)
    if (!window.confirm(`Delete ${student?.name ?? 'this student'}?`)) return
    setStudents(current => current.filter(item => item.id !== studentId))
    if (selectedStudent?.id === studentId) setSelectedStudent(null)
  }

  // Throttled reset example: repeated clicks are ignored for 1.5 seconds.
  const handleReset = useThrottle(() => {
    setForm(emptyForm)
    setErrors({})
    setNotice('Registration form cleared.')
    window.setTimeout(() => setNotice(''), 2500)
  }, 1500)

  const femaleCount = students.filter(student => student.gender === 'Female').length

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon"><GraduationCap size={25} /></div><div><strong>EduManage</strong><span>ADMIN PORTAL</span></div></div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><Users size={18} /> Students <span className="nav-count">{students.length}</span></div>
        <div className="side-note"><ShieldCheck size={17} /><span>Administrator<br /><b>Records management</b></span></div>
        <div className="sidebar-bottom">Student Management System<br /><span>Version 1.0.0</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><div className="breadcrumb">Workspace / <b>Students</b></div><h1>Student management</h1><p>Register, search and manage student records.</p></div><div className="admin-chip"><div className="avatar">AD</div><span><b>Administrator</b><small>System admin</small></span></div></header>

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-icon blue"><Users size={20}/></div><div><span>Total students</span><strong>{students.length}</strong><small>Registered records</small></div></div>
          <div className="stat-card"><div className="stat-icon purple"><UserRound size={20}/></div><div><span>Female students</span><strong>{femaleCount}</strong><small>Current records</small></div></div>
          <div className="stat-card"><div className="stat-icon green"><BookOpen size={20}/></div><div><span>Classes represented</span><strong>{new Set(students.map(s => s.className)).size}</strong><small>Unique class groups</small></div></div>
        </section>

        {notice && <div className="notice"><CheckCircle2 size={17}/>{notice}</div>}

        <section className="content-grid">
          <div className="panel registration-panel">
            <div className="panel-heading"><div><span className="eyebrow">NEW RECORD</span><h2>Register a student</h2><p>Enter the student's information below.</p></div><div className="heading-icon"><Plus size={20}/></div></div>
            <form onSubmit={addStudent} noValidate>
              <div className="field"><label htmlFor="name">Full name <i>*</i></label><input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Alex Uwimana"/>{errors.name && <small className="error">{errors.name}</small>}</div>
              <div className="field"><label htmlFor="email">Email address <i>*</i></label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com"/>{errors.email && <small className="error">{errors.email}</small>}</div>
              <div className="field"><label htmlFor="className">Class / Programme <i>*</i></label><input id="className" name="className" value={form.className} onChange={handleChange} placeholder="e.g. S4 Software Development"/>{errors.className && <small className="error">{errors.className}</small>}</div>
              <div className="field"><label htmlFor="gender">Gender <i>*</i></label><select id="gender" name="gender" value={form.gender} onChange={handleChange}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select>{errors.gender && <small className="error">{errors.gender}</small>}</div>
              <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+250 788 000 000"/>{errors.phone && <small className="error">{errors.phone}</small>}</div>
              <div className="field"><label htmlFor="address">Address</label><input id="address" name="address" value={form.address} onChange={handleChange} placeholder="District / City"/></div>
              <div className="form-actions"><button className="btn btn-primary" type="submit"><Plus size={17}/> Register student</button><button className="btn btn-light" type="button" onClick={() => handleReset()}>Clear</button></div>
            </form>
            <div className="required-note">* Required fields</div>
          </div>

          <div className="panel students-panel">
            <div className="panel-heading list-heading"><div><span className="eyebrow">DIRECTORY</span><h2>Student records <span className="total-pill">{students.length}</span></h2><p>Click a record to view complete details.</p></div></div>
            <div className="search-wrap"><Search size={18}/><input ref={searchRef} value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search by name, email, class..."/><kbd>Ctrl K</kbd></div>
            <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>CLASS</th><th>CONTACT</th><th>ACTIONS</th></tr></thead><tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} onClick={() => setSelectedStudent(student)} className="student-row">
                  <td><div className="student-cell"><div className="student-avatar">{student.name.split(' ').map(part => part[0]).slice(0,2).join('').toUpperCase()}</div><div><b>{student.name}</b><small>{student.email}</small></div></div></td>
                  <td><span className="class-tag">{student.className}</span></td>
                  <td><span className="contact">{student.phone || 'Not provided'}</span></td>
                  <td><div className="action-buttons"><button className="icon-btn view" type="button" title="View details" onClick={event => { event.stopPropagation(); setSelectedStudent(student) }}><Eye size={16}/></button><button className="icon-btn delete" type="button" title="Delete student" onClick={event => deleteStudent(event, student.id)}><Trash2 size={16}/></button></div></td>
                </tr>
              ))}
              {filteredStudents.length === 0 && <tr><td colSpan="4"><div className="empty-state"><Users size={28}/><b>No students found</b><span>Try another search or register a new student.</span></div></td></tr>}
            </tbody></table></div>
            <div className="table-footer">Showing <b>{filteredStudents.length}</b> of <b>{students.length}</b> students <span>Search updates after you stop typing</span></div>
          </div>
        </section>
        <footer className="footer"><span>© 2026 EduManage Student Portal</span><span><Keyboard size={14}/> Shortcuts: <b>Ctrl + K</b> search · <b>Esc</b> close details</span></footer>
      </main>

      {selectedStudent && <div className="modal-backdrop" onClick={closeDetails}><section className="details-modal" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="details-title">
        <div className="modal-top"><div><span className="eyebrow">STUDENT PROFILE</span><h2 id="details-title">Student details</h2></div><button className="icon-btn" onClick={closeDetails} aria-label="Close details"><X size={19}/></button></div>
        <div className="profile-header"><div className="profile-avatar">{selectedStudent.name.split(' ').map(part => part[0]).slice(0,2).join('').toUpperCase()}</div><div><h3>{selectedStudent.name}</h3><span>{selectedStudent.className}</span></div></div>
        <div className="detail-list">{[['Email address', selectedStudent.email], ['Phone number', selectedStudent.phone || 'Not provided'], ['Gender', selectedStudent.gender], ['Address', selectedStudent.address || 'Not provided'], ['Registration date', selectedStudent.createdAt]].map(([label, value]) => <div className="detail-row" key={label}><span>{label}</span><b>{value}</b></div>)}</div>
        <button className="btn btn-primary modal-close" onClick={closeDetails}>Close profile</button>
      </section></div>}
    </div>
  )
}