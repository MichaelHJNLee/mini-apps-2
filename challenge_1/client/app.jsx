import React from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      pageCount: 0,
      data: [],
      currentPage: 1,
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.searchTerm = this.searchTerm.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value
    }, () => {
      this.searchTerm(this.state.search);
    })
  }

  searchTerm(term) {
    axios.get(`/events?_page=1&_limit=10&q=${term}`)
      .then((data) => {
        this.setState({
          pageCount: Math.ceil(data.headers['x-total-count'] / 10),
          currentPage: 1,
          data: data.data,
        })
      })
  }

  handlePageClick(e) {
    axios.get(`/events?_page=${e.selected + 1}&_limit=10&q=${this.state.search}`)
      .then((data) => {
        this.setState({
          currentPage: e.selected + 1,
          data: data.data,
        })
      })
  }

  render() {
    return(
      <div>
        <input type='text' onChange={(e) => {this.handleSearch(e)}}></input>
        <br/>
        {this.state.data.map((entry, index) => {
          return (<div key={index}>{entry.description}</div>)
        })}
        <ReactPaginate 
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={5}
          pageRangeDisplayed={10}
          onPageChange={(e) => {this.handlePageClick(e)}}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          id={'react-paginate'}
        />
      </div>
    )
  }
}

export default App;