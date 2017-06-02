import React from 'react';

class SearchRequest extends React.Component {
	constructor(props){
    super(props)
    this.state = {
      searchQuery: ''
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }

  handleChange(event){
    this.setState({
      searchQuery: event.target.value
    })
    console.log(this.state.searchQuery);
  }

  render(){
    return(
      <div>
        <input
          type="text"
          onKeyPress={this._handleKeyPress}
          onChange={this.handleChange.bind(this)}
          defaultValue={this.state.searchItem}
          />

      </div>
    )
  }

	
}

export default SearchRequest;