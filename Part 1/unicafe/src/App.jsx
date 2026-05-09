import { useState } from 'react'

const Header = ({ text }) => <><h1>{text}</h1></>
const Button = ({ onClick, text }) => <><button onClick = {onClick}>{text}</button></>
const Statistic = ({ value, text}) => <div>{text} {value}</div>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const average = () => (good-bad)/(good+neutral+bad)
  const positive = () => (good * 100)/(good+neutral+bad) + '%'

  return (
    <div>
      <Header text = 'give feedback'/>
      <Button onClick = {() => setGood(good + 1)} text = 'good'/>
      <Button onClick = {() => setNeutral(neutral + 1)} text = 'neutral'/>
      <Button onClick = {() => setBad(bad + 1)} text = 'bad'/>
      <Header text = 'statistics'/>
      <Statistic text = 'good' value = {good}/>
      <Statistic text = 'neutral' value = {neutral}/>
      <Statistic text = 'bad' value = {bad}/>
      <Statistic text = 'average' value = {average()}/>
      <Statistic text = 'positive' value = {positive()}/>
    </div>
  )
}

export default App