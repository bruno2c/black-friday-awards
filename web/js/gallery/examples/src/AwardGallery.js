import React from 'react';
import Gallery from 'react-photo-gallery';
import SelectedImage from './SelectedImage';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentSelect from 'material-ui/svg-icons/content/send';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Avatar from 'material-ui/Avatar';
import UserIcon from 'material-ui/svg-icons/action/face'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import fetch from 'isomorphic-fetch'
import {
    white,
} from 'material-ui/styles/colors';
import update from 'react-addons-update';

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

function authenticate() {
    return async function () {
        try {
            const response = await fetch(baseUrl + `/contest/` + `${this.state.contestId}/participant/${this.state.loginCpf}`, {
                credentials: 'same-origin'
            });
            const json = await response.json();

            if (json.code != 200) {
                this.setState({altError: json.message});
                return;
            }

            this.setState({isLogged: true});
            this.setState({remainingVotes: json.remaining_votes});
            this.setState({name: json.participant.name});
            this.setState({getVotes: json.votes});

            let photos = this.state.photos;

            json.votes.filter(votes => {
                this.state.photos.filter((key, index) => {
                  if (key.id == votes.image_id) {
                      photos[index].disable = true
                  }
                });
            })

            this.setState({photos: photos});
        } catch (e) {
            console.log('Cpf não encontrado', e)
        }
    }
}


function confirmVote() {
    return async function () {

        let data = new FormData();
        data.append('images', this.state.votes);
        data.append('contest_id', this.state.contestId);
        data.append('document', this.state.loginCpf);
        const url = baseUrl + '/contest/vote';

        try {
            const response = await fetch(url, {
                body: data,
                credentials: 'same-origin',
                method: 'POST'
            })
            const json = await response.json()
            return  json.code;
        } catch (e) {
            console.log(e)
        }
    }
}


class AwardGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: this.props.photos.slice(0, 30),
            selectAll: false,
            pageNum: 1,
            totalPages: 3,
            loadedAll: false,
            openDialog: false,
            loginCpf: false,
            name: '',
            error: '',
            contestId: 1,
            isLogged: false,
            remainingVotes: 0,
            openDialogConfirm: false,
            votes: [],
            responseVote: '',
            snackOpen: false,
            getVotes: ''
        };
        this.selectPhoto = this.selectPhoto.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this)
        this.handleScroll = this.handleScroll.bind(this);
        this.loadMorePhotos = this.loadMorePhotos.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.authenticate = authenticate();
        this.confirmVote = confirmVote();
        this.loadMorePhotos = debounce(this.loadMorePhotos, 200);

    }

    selectPhoto(event, obj) {
        if (this.state.loginCpf == '' && this.state.isLogged == false) {
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
        if (count > this.state.remainingVotes && photos[obj.index].selected != true) {
            alert(`Você possui ${this.state.remainingVotes} voto(s) restante(s)`);
            return false;
        }
        photos[obj.index].selected = !photos[obj.index].selected;

        if (photos[obj.index].selected  == true) {
            var imagesId = this.state.votes.slice()

            imagesId.push(photos[obj.index].id)
            this.setState({votes: imagesId })
        } else {
            let teste = this.state.votes.indexOf(photos[obj.index].id);
            let arr = this.state.votes.splice(teste, 1);
            let ts = this.state.votes
            ts = {$splice: [[teste, 1]]};
            let i =  update(this.state.votes, ts)
        }

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
            photos: this.state.photos.concat(this.props.photos.slice(this.state.photos.length, this.state.photos.length + 30)),
            pageNum: this.state.pageNum + 1
        });
    }

    handleOpen() {
        this.setState({openDialog: true});
    };

    handleLogin = () => {
        if (this.state.loginCpf == false) {
            this.setState({error: 'O campo CPF é obrigatório'});
            return;
        }
        this.authenticate();
        this.setState({openDialog: false});
    };


    handleConfirm = () => {
        let imagesId = []
        let photos = this.state.photos;

        photos.filter(key => {
            if (key.selected == true) {
                imagesId.push(key.id)
            }
        });

        this.confirmVote();

        setTimeout(function () {
            window.location.reload();
        }, 3000);
        // var yourUl = document.getElementById("alertDiv");
        // yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
        this.setState({snackOpen: true});
        this.setState({openDialogConfirm: false});

        //

    };

    handleClose = () => {
        this.setState({error: ''});
        this.setState({openDialog: false});
    };


    handleCloseConfirm = () => {
        this.setState({error: ''});
        this.setState({openDialogConfirm: false});
    };

    handleChange(event) {
        this.setState({loginCpf: event.target.value});
        this.setState({error: ''});
    };

    handleOpenConfirm(event) {

        this.setState({openDialogConfirm: true});
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

        const actionsConfirm = [
            <FlatButton
                label="Ok"
                primary={true}
                onClick={this.handleConfirm}
            />,
            <FlatButton
                label="Cancelar"
                secondary={true}
                onClick={this.handleCloseConfirm}
            />
        ];

        return (
            <MuiThemeProvider>
                <div>

                {this.state.isLogged == false && this.state.loginCpf != '' &&
                    <div>{{ this.state.altError }}</div>
                }

                {this.state.isLogged == true  ?
                    <div style={{float: 'right', position: 'absolute', top: 54}}>
                        <Avatar
                        icon={<UserIcon/>}
                        color={'#6022a8'}
                        backgroundColor={white}
                        size={40}
                        style={{float: 'left', lineHeight: '50%'}}
                        />
                        <h2 style={{float: 'right', lineHeight: '5%'}}>{this.state.name}</h2>
                        </div>
                : null
                }
                    {/*<div id="alertDiv"  disabled={true} style={{float: 'left', position: 'absolute', top: 29, right: 100, display: 'none'}}>*/}
                        {/*<div style={{backgroundColor: 'green'}}><h1 style={{color: 'white'}}>Voto realizado com sucesso</h1></div>*/}
                    {/*</div>*/}
                    <Snackbar
                        open={this.state.snackOpen}
                        message="Voto realizado com sucesso"
                        autoHideDuration={4000}
                        style={{color: 'red'}}
                        onRequestClose={this.handleRequestClose}
                    />
            <div style={{position: 'relative'}}>


                <div style={{overflowY: 'auto'}}>
                    <Gallery photos={this.state.photos} columns={this.props.columns} onClick={this.selectPhoto} enableSelect={this.state.remainingVotes  < 1 ? false : true}
                             ImageComponent={SelectedImage}/>

                    {!this.state.loadedAll && <div className="loading-msg" id="msg-loading-more">Loading</div>}
                </div>
                {count > 0 ?
                    <FloatingActionButton style={{  position: 'fixed', top: '90%',  left:'95.5%' }} onClick={(e) => this.handleOpenConfirm()}>
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
                        errorText={this.state.error}
                    >
                        {/*<InputMask mask="999.999.9x'9-99" maskChar=" " />*/}
                    </TextField>
                </Dialog>

                <Dialog
                    title="Deseja Confirmar ?"
                    actions={actionsConfirm}
                    modal={false}
                    open={this.state.openDialogConfirm}
                    onRequestClose={this.handleCloseConfirm}
                >
                </Dialog>
            </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AwardGallery;
