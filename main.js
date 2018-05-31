const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case 'TOGGLE_TODO':
            return state.map(item => {
                if (item.id === action.id) {
                    return Object.assign({}, item, {completed: !item.completed})
                }
                return item
            })
        case 'DELETE_TODO':
            return state.filter((todo) => {
                return todo.id === action.id
            })
        default:
            return state
    }
}

const visibility = (state = 'ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
}

const todosCounter = (state = 0, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return state + 1
        case 'REMOVE_TODO':
            return state - 1
        default:
            return state
    }
}


const {combineReducers, createStore} = Redux

const todoApp = combineReducers(
    {
        todos,
        visibility,
        todosCounter
    })

const store = createStore(todoApp)

console.log('initial state')
console.log(store.getState())

const {Component} = React

const FilterLink = ({filter, currentFilter, children}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>
    }

    return <a href='#' onClick={(e) => {
        console.log('click', filter)
        e.preventDefault()
        store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter
        })
    }
    }>
        {children}
    </a>
}


const filterTodos = (state) => {
    const filter = state.visibility

    switch (filter) {
        case 'ALL':
            return state.todos
        case 'TODO':
            return state.todos.filter((todo) => !todo.completed)
        case 'COMPLETED':
            return state.todos.filter((todo) => todo.completed)
    }
}

const TodoItem = (
    {onclick, completed, text}) => (
    <li onClick={onclick}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}>
        {text}
    </li>
)

const TodoList = (
    {
        todos,
        onTodoClick
    }) => (
    <ul>
        {todos.map((todo) => {
            return <TodoItem key={todo.id}
                             onclick={onTodoClick(todo.id)}
                             completed={todo.completed}
                             text={todo.text}
            />
        })}
    </ul>
)


class TodoApp extends Component {
    render() {
        const filtered = filterTodos(this.props)
        return (
            <div>
                <input ref={node => {
                    this.input = node
                }}/>
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: this.props.todosCounter,
                        text: this.input.value
                    })
                }
                }> Add TODO
                </button>
                <TodoList
                    todos={filtered}
                    onclick={(id) => store.dispatch({
                        type: 'TOGGLE_TODO',
                        id: id
                    })}
                />
                <p>
                    Filter by: <br/>
                    <FilterLink currentFilter={this.props.visibility} filter='ALL'>All</FilterLink>
                    {' '}
                    <FilterLink currentFilter={this.props.visibility} filter='COMPLETED'>Completed</FilterLink>
                    {' '}
                    <FilterLink currentFilter={this.props.visibility} filter='TODO'>Pending</FilterLink>
                </p>
            </div>

        )
    }
}

const render = () => {
    console.log('render function')
    console.log(store.getState())
    ReactDOM.render(
        <TodoApp {...store.getState()}/>,
        document.getElementById('root')
    )
}

store.subscribe(render)

render()