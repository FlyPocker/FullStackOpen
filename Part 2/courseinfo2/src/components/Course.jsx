const Total = ({ parts }) => {
    const total = parts.reduce((s, p) => s+p.exercises,0)
    return(
        <h4>total of {total} exercises</h4>
    )
}
const Header = ({ text }) => <h2>{text}</h2>
const Part = ({ part }) => (
  <li>
    {part.name} {part.exercises}
  </li>
)
const Content = ({ parts }) => (
  <div>
    <ul>
      {parts.map(part => <Part key={part.id} part={part}/>)}
    </ul>
  </div>
)

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course