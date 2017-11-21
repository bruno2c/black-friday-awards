import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-images';


import Photo, {photoPropType} from './Photo';
import {computeSizes} from './utils';

class Gallery extends React.Component {
    constructor() {
        super();
        this.state = {
            containerWidth: 0,
            lightboxIsOpen: false,
            currentImage : 0
        };

        this.handleResize = this.handleResize.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
    }

    componentDidMount() {
        this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        if (this._gallery.clientWidth !== this.state.containerWidth) {
            this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false);
    }

    handleResize(e) {
        this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
    }

    handleClick(event, {index}) {
        const {photos, onClick} = this.props;
        onClick(event, {
            index,
            photo: photos[index],
            previous: photos[index - 1] || null,
            next: photos[index + 1] || null,
        });
    }
    openLightbox(event, obj) {
        console.log('open')
        this.setState({
            currentImage: obj.index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }
    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }



    render() {
        const {ImageComponent = Photo} = this.props;
        // subtract 1 pixel because the browser may round up a pixel
        const width = this.state.containerWidth - 1;
        const {photos, columns, margin, onClick} = this.props;
        const thumbs = computeSizes({width, columns, margin, photos});
        return (
            <div className="react-photo-gallery--gallery">
                <div ref={c => (this._gallery = c)}>
                    {thumbs.map((photo, index) => {
                        const {width, height} = photo;
                        return (
                                <ImageComponent
                                    key={photo.key || photo.src}
                                    margin={margin}
                                    index={index}
                                    photo={photo}
                                    onClick={this.openLightbox}
                                    selectClick={this.handleClick}
                                />


                        );
                    })}
                </div>
                <Lightbox images={photos}
                          onClose={this.closeLightbox}
                          isOpen={this.state.lightboxIsOpen}
                          onClickPrev={this.gotoPrevious}
                          onClickNext={this.gotoNext}
                          currentImage={this.state.currentImage}
                />
                <div style={{content: '', display: 'table', clear: 'both'}}/>

            </div>
        );
    }
}

Gallery.propTypes = {
    photos: PropTypes.arrayOf(photoPropType).isRequired,
    onClick: PropTypes.func,
    columns: PropTypes.number,
    margin: PropTypes.number,
    ImageComponent: PropTypes.func,
};

Gallery.defaultProps = {
    columns: 3,
    margin: 2,
};

export default Gallery;
