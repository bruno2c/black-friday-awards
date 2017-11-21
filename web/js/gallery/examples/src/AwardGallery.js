import React from 'react';
import Gallery from 'react-photo-gallery';
import SelectedImage from './SelectedImage';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentSelect from 'material-ui/svg-icons/content/send';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import InputMask from 'react-input-mask'

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        let later = function () {
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
        this.state = {
            photos: this.props.photos.slice(0, 9),
            selectAll: false,
            pageNum: 1,
            totalPages: 3,
            loadedAll: false,
            openDialog: false,
            loginCpf: false
        };
        this.selectPhoto = this.selectPhoto.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this)
        this.handleScroll = this.handleScroll.bind(this);
        this.loadMorePhotos = this.loadMorePhotos.bind(this);
        this.loadMorePhotos = this.loadMorePhotos.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.loadMorePhotos = debounce(this.loadMorePhotos, 200);
    }

    selectPhoto(event, obj) {
        if (this.state.loginCpf == '') {
            this.handleOpen();
            return;
        }
        let photos = this.state.photos;
        let count = 1;
        photos.filter(key => {
            if (key.selected == true) {
                count++
            }
        });
        if (count > 5 && photos[obj.index].selected != true) {
            alert('Só é possível selecionar 5 fotos');
            return false;
        }
        photos[obj.index].selected = !photos[obj.index].selected;
        this.setState({photos: photos});
    }

    toggleSelect() {
        let photos = this.state.photos.map((photo, index) => {
            return {...photo, selected: !this.state.selectAll}
        });
        this.setState({photos: photos, selectAll: !this.state.selectAll});
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            this.loadMorePhotos();
        }
    }

    loadMorePhotos() {
        if (this.state.pageNum > this.state.totalPages) {
            this.setState({loadedAll: true});
            return;
        }
        this.setState({
            photos: this.state.photos.concat(this.props.photos.slice(this.state.photos.length, this.state.photos.length + 6)),
            pageNum: this.state.pageNum + 1
        });
    }

    handleOpen() {
        this.setState({openDialog: true});
    };

    handleLogin= () => {
        // this.autenticate(this.state.loginCpf);
        this.setState({openDialog: false});
    };

    handleClose = () => {
        this.setState({openDialog: false});
    };

    handleChange(event) {
        this.setState({loginCpf: event.target.value});
        console.log(this.state.loginCpf);
    };

    render() {
        let count = 0;
        this.state.photos.filter(key => {
            if (key.selected == true) {
                count++
            }
        });
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onClick={this.handleLogin}
            />,
            <FlatButton
                label="Cancelar"
                secondary={true}
                onClick={this.handleClose}
            />
        ];

        return (
            <MuiThemeProvider>
            <div style={{position: 'relative'}}>
                <div style={{overflowY: 'auto'}}>
                    <Gallery photos={this.state.photos} columns={this.props.columns} onClick={this.selectPhoto}
                             ImageComponent={SelectedImage}/>

                    {!this.state.loadedAll && <div className="loading-msg" id="msg-loading-more">Loading</div>}
                </div>
                {count > 0 ?
                    <FloatingActionButton style={{  position: 'fixed', top: '90%',  left:'95.5%' }} onClick={(e) => selectClick(e, {index, photo})}>
                    <ContentSelect/>
                    </FloatingActionButton>
                    : null}
                <Dialog
                    title="Informe o CPF"
                    actions={actions}
                    modal={false}
                    open={this.state.openDialog}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        floatingLabelText="CPF"
                        onChange={this.handleChange}
                    >
                        <InputMask mask="999.999.999-99" maskChar=" " />
                    </TextField>
                </Dialog>
            </div>
            </MuiThemeProvider>
        );
    }
}

export default AwardGallery;
