const Header = (props) => {
  return (
  <>
    <h1>{props.course}</h1>
  </>
  )
}

const Part = (props) => {
  console.log('Part input: ', props)
  return (
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  )
}

const Content = (props) => {
  console.log('Content input: ', props)
  return (
    <>
      <Part part={props.part[0]}/>
      <Part part={props.part[1]}/>
      <Part part={props.part[2]}/>
    </>
  )
}

const Total = (props) => {
  console.log('Total input: ', props)
  return (
    <>
      <p>
        Number of exercises {props.part[0].exercises + props.part[1].exercises + props.part[2].exercises}    
      </p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content part={[part1,part2,part3]} />
      <Total part={[part1,part2,part3]}/>
    </div>
  )
}

export default App