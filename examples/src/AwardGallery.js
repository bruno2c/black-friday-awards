import React from 'react';
import Gallery from 'react-photo-gallery';
import SelectedImage from './SelectedImage';

function debounce(func, wait, immediate) {
  let timeout;
return function() {
      const context = this, args = arguments;
  let later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        
  };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    
};

};

class AwardGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { photos: this.props.photos.slice(0,9), selectAll: false, pageNum:1, totalPages:3, loadedAll: false };
    this.selectPhoto = this.selectPhoto.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);

    this.handleScroll = this.handleScroll.bind(this);
    this.loadMorePhotos = this.loadMorePhotos.bind(this);
    this.loadMorePhotos = debounce(this.loadMorePhotos, 200);
  }
  selectPhoto(event, obj){
    let photos = this.state.photos;
    photos[obj.index].selected = !photos[obj.index].selected;
    this.setState({photos: photos});
  }
  toggleSelect(){
    let photos = this.state.photos.map((photo,index)=> { return {...photo, selected: !this.state.selectAll}});
    this.setState({photos: photos, selectAll: !this.state.selectAll});
  }
  componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
  }
  handleScroll(){
    let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            this.loadMorePhotos();
    }
  }
  loadMorePhotos(){
    if (this.state.pageNum > this.state.totalPages){
            this.setState({loadedAll: true});
            return;
    }
    this.setState({
      photos: this.state.photos.concat(this.props.photos.slice(this.state.photos.length,this.state.photos.length+6)), 
      pageNum: this.state.pageNum + 1
    });
  }
  render(){
    return (
      <div>
        <h2>Using the ImageComponent prop</h2>
        <h3>Pass in a custom image component to create any visual representation such as selection</h3>
        <p><button className="toggle-select" onClick={this.toggleSelect}>toggle select all</button></p>
        <Gallery photos={this.state.photos} columns={this.props.columns} onClick={this.selectPhoto} ImageComponent={SelectedImage}/>
        {!this.state.loadedAll && <div className="loading-msg" id="msg-loading-more">Loading</div>}
      </div>
    );
  }
}

export default AwardGallery;
