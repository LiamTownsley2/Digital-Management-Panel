import { TextBlock } from "react-placeholder/lib/placeholders";
import { Link } from "react-router-dom";
import { Component } from 'react';
import { SoftwareAsset } from '../../../components/assets/software/SoftwareAsset';
import PillButton from "../../PillButton";

class SoftwareLinkTable extends Component<{ assets: { software: SoftwareAsset, link: any }[], id: string }> {
    constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
    }

    refreshPage() {
        window.location.reload();
    }

    render() {
        console.log(this.props.assets);
        if (!this.props.assets || this.props.assets.length == 0) {
            return <TextBlock rows={3} color='#CDCDCD' />
        }

        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Link ID</th>
                            <th scope="col">Software Name</th>
                            <th scope="col">Software Version</th>
                            <th scope="col">Risk Level</th>
                            <th scope="col">Installed By</th>
                            <th scope="col">Installed Date</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.assets.map((item: any) => {
                            const date = new Date(item.link.date);
                            return (
                                <tr key={item.software._id}>
                                    <td><code>{item.link._id}</code></td>
                                    <td>{item.software.name}</td>
                                    <td><code>{item.software.version}</code></td>
                                    <td><PillButton label={item.software.risk_level} /></td>
                                    <td>{item.link.created_by}</td>
                                    <td>{date.toLocaleDateString()} ({date.toLocaleTimeString()})</td>
                                    <td>
                                        <Link to={`/software/${item.software._id}`} role="button" id="blue-button" className="btn btn-outline-primary "><i className="fa fa-eye" /> View Asset</Link>
                                        <Link to={`/software/${item.software._id}/edit`} role="button" id="blue-button" className="btn btn-outline-primary "><i className="fa fa-edit" /> Edit Asset</Link>
                                        <Link to={`/software/${item._id}/scans`} role="button" id="blue-button" className="btn btn-outline-secondary"><i className="fa fa-dot-circle-o" /> View Scans</Link>
                                        {/* @TODO (NIST): Change below link to API request to start a scan. */}
                                        <Link to={`/software/${item._id}/scan`} role="button" id="blue-button" className="btn btn-outline-secondary"><i className="fa fa-wrench" /> Scan Asset</Link>
                                        <button onClick={() => {
                                            fetch(`http://127.0.0.1:3001/api/asset-link/hardware/${this.props.id}/${item.software._id}`, { method: 'DELETE' }).then(() => {
                                                this.refreshPage();
                                            })
                                        }} className="btn btn-outline-danger"><i className="fa fa-trash" /> Delete Asset Link</button>

                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div >
        );

    }
}

export default SoftwareLinkTable;