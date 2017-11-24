import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ArrowNext from 'material-ui/svg-icons/action/trending-flat';
import ReactTransitions from 'react-transitions';
import update from 'react-addons-update';


class Winners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: this.props.winners,
            next: false
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({photos: nextProps.winners})
    }

    handleShow() {
        let url = this.state.photos.slice(-1)[0];

        let img = document.getElementById('imgWinner');
        img.src = url.url
        this.setState({next: true});
    }

    handleNext() {
        let url = this.state.photos.slice(-1)[0];
        console.log(url.id)
        let teste = this.state.photos.indexOf(url.id);
        let arr = this.state.photos.splice(teste, 1);
        let ts = this.state.photos
        ts = {$splice: [[teste, 1]]};
        let i =  update(this.state.photos, ts)
        let img = document.getElementById('imgWinner');
        img.src = ''
        this.setState({next: false});
    }

    render() {
        console.log(this.state.photos)
        return (
            <MuiThemeProvider>
                {this.state.photos ?
                    <div style={{top: 200, position: 'absolute', width: '100%'}}>
                        {/*{this.props.winners.map((row, index) => {*/}
                            {/*return <img src={row.url}></img>*/}
                            {/*}*/}
                        {/*)}*/}
                        <h1 style={{marginLeft: "47%"}}>{this.state.photos.length}&#8304; Lugar</h1>
                        {this.state.next ?
                            <FloatingActionButton style={{position: 'absolute', left: '49%', top: 70}}
                                                  onClick={(e) => this.handleNext()}>
                                <ArrowNext/>
                            </FloatingActionButton> :
                            <FloatingActionButton style={{position: 'absolute', left: '49%', top: 70}}
                                                  onClick={(e) => this.handleShow()}>
                                <ContentAdd/>
                            </FloatingActionButton>
                        }
                        <div style={{position: 'absolute', top: 150, marginLeft: '27%'}}>
                        <ReactTransitions
                            transition="fade-move-from-right"
                            width={ 900 }
                            height={ 600 }

                        >
                            {/* The child element put here changes with animation. */}
                            <img id='imgWinner' key="uniqueKey" src="" />
                        </ReactTransitions>
                        </div>
                    </div>
                 : null}
            </MuiThemeProvider>
        );
    }
}

export default Winners;
