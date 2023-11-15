import { TextBlock } from "react-placeholder/lib/placeholders";
import PillButton from "../PillButton";
import { Link } from "react-router-dom";
import { Component } from 'react';
import { Asset } from "../../interfaces/Asset";

class AssetTable extends Component<{ assets: Asset[] }> {
    constructor(props: any) {
        super(props);
    }

    render() {
        if(!this.props.assets || this.props.assets.length == 0) {
            return <TextBlock rows={3} color='#CDCDCD' />
        }

        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Asset ID</th>
                            <th scope="col">System Name</th>
                            <th scope="col">System Type</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.assets.map((item: any) => (
                            <tr key={item._id}>
                                <td><code>{item._id}</code></td>
                                <td>{item.name}</td>
                                <td><PillButton label={item.type} /></td>
                                <td>
                                    <Link to={`/assets/${item._id}`} role="button" id="blue-button" className="btn btn-outline-primary"><i className="fa fa-eye" /> View Asset</Link>
                                    <Link to={`/edit/assets/${item._id}`} role="button" id="blue-button" className="btn btn-outline-primary"><i className="fa fa-edit" /> Edit Asset</Link>
                                    <button onClick={() => {
                                        fetch(`http://127.0.0.1:3001/api/assets/${item._id}/delete`, { method: 'DELETE' }).then(() => {
                                            refreshPage();
                                        })
                                    }} className="btn btn-outline-danger"><i className="fa fa-trash" /> Delete Asset</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        );

    }
}

function refreshPage() {
    window.location.reload();
}

export default AssetTable;