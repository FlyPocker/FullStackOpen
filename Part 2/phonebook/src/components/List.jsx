const ListElement = ({ person }) => <li>{person.name}: {person.number}</li> 

const List = ({ list }) => {
    
    return(
    <ul>
        {list.map(number => <ListElement key={number.name} person={number}/>)}
    </ul>
)}

export default List