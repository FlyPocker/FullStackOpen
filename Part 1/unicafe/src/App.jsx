import { useState } from 'react'

const Header = ({ text }) => <><h1>{text}</h1></>
const Button = ({ onClick, text }) => <><button onClick = {onClick}>{text}</button></>
const Buttons = ({ onClick }) => {
  return(
    <>
    <Button onClick={onClick[0]} text='good'/>
    <Button onClick={onClick[1]} text='neutral'/>
    <Button onClick={onClick[2]} text='bad'/>
    </>
  )
}
const Stat = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>
const Statistics =({ text, value }) =>{
  console.log(value)
  const average = () => (value[0]-value[2])/(value[0]+value[1]+value[2])
  const positive = () => (value[0] * 100)/(value[0]+value[1]+value[2]) + '%'
  if (value[0] === value[1] && value[1] === value[2] && value[0] === 0) {
    return (<div>{'No feedback given'}</div>)
  }
  return(
    <table>
      <tbody>
        <Stat text={text[0]} value={value[0]}/>
        <Stat text={text[1]} value={value[1]}/>
        <Stat text={text[2]} value={value[2]}/>
        <Stat text={text[3]} value={average()}/>
        <Stat text={text[4]} value={positive()}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)
  return (
    <div>
      <Header text = 'give feedback'/>
      <Buttons onClick = {[handleGood,handleNeutral,handleBad]}/>
      <Header text = 'statistics'/>
      <Statistics text = {['good','neutral','bad','average','positive']} value = {[good,neutral,bad]}/>
    </div>
  )
}//<Button onClick = {[fun(setGood,good),fun(setNeutral,neutral),fun(setBad,bad)]} text = {['good','neutral','bad']}/>

export default App