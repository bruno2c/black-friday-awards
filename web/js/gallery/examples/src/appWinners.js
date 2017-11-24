import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch'
import Winners from './winner';

function getWinners() {
    return async function () {
        const url = baseUrl + `/contest/` + contestId + `/winners`;
        try {
            const response = await fetch(url, {
                credentials: 'same-origin'
            });
            const json = await response.json();

            this.setState({winners: json.ranking});

        } catch (e) {
            console.log('error', e)
        }
    }
}

class AppWinners extends React.Component {
    constructor() {
        super();
        this.state = {width: -1, winners: ''};
        this.getWinners = getWinners();
    }

    componentDidMount() {
        this.getWinners();
    }


    render() {
        return (
                <Winners winners={this.state.winners}/>
        )
    }
}

if (document.getElementById('app-winners')) {
    ReactDOM.render(<AppWinners/>, document.getElementById('app-winners'));
}
