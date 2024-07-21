import React, { useEffect } from 'react';
import { Layout, message, Avatar, Button, Form, Input, Divider, Upload, Modal, Tooltip, Radio, Space } from 'antd';
import {
    KeyOutlined,
    LockOutlined,
    UploadOutlined,
    DeleteOutlined,
    MailOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import { Ellipsis } from 'react-spinners-css';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            disableUpload: false,
            deleteAccountModal: false,
            email: "",
            loading: true,
            participantCategory: "",
            categoryList: [""]
        }
    }

    componentDidMount() {
        this.getAccountSettings()
    }

    getAccountSettings = async () => {
        await fetch(window.ipAddress + "/v1/account/settings", {
            method: 'get',
            headers: { 'Content-Type': 'application/json', "Authorization": window.IRSCTFToken }
        }).then((results) => {
            return results.json(); //return data in JSON (since its JSON data)
        }).then((data) => {
            if (data.success === true) {
                let category = "none"
                if (data.category) category = data.category
                this.setState({ email: data.email, participantCategory: category, categoryList: data.categoryList })
            }
            else {
                message.error({ content: "Oops. Unknown error." })
            }

        }).catch((error) => {
            console.log(error)
            message.error({ content: "Oops. There was an issue connecting with the server" });
        })
        this.setState({ loading: false })
    }

    deleteProfilePic() {
        fetch(window.ipAddress + "/v1/profile/deleteUpload", {
            method: 'get',
            headers: { 'Content-Type': 'application/json', "Authorization": window.IRSCTFToken }
        }).then((results) => {
            return results.json(); //return data in JSON (since its JSON data)
        }).then((data) => {
            if (data.success === true) {
                message.success({ content: "Reset profile picture to default" })
            }
            else if (data.error === "already-default") {
                message.warn("Profile picture is already default.")
            }
            else {
                message.error({ content: "Oops. Unknown error." })
            }

        }).catch((error) => {
            console.log(error)
            message.error({ content: "Oops. There was an issue connecting with the server" });
        })
    }


    render() {
        return (
            <Layout className="layout-style">

                {this.state.loading ? (
                    <div style={{ position: "absolute", left: "55%", transform: "translate(-55%, 0%)", zIndex: 10 }}>
                        <Ellipsis color="#177ddc" size={120} />
                    </div>
                ) : (
                    <div>
                        <Modal
                            title={"Delete Account"}
                            visible={this.state.deleteAccountModal}
                            footer={null}
                            onCancel={() => { this.setState({ deleteAccountModal: false }) }}
                            confirmLoading={this.state.modalLoading}
                        >

                            <DeleteAccountForm logout={this.props.logout.bind(this)} setState={this.setState.bind(this)} />
                        </Modal>


                        <Divider />
                        <div style={{ display: "flex", marginRight: "5ch", alignItems: "center", justifyItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "initial", width: "20ch", overflow: "hidden" }}>
                                <Avatar style={{ backgroundColor: "transparent", width: "12ch", height: "12ch" }} size='large' src={"/static/profile/" + this.props.username + ".webp"} />
                                <div style={{ marginTop: "2ch", display: "flex" }}>
                                    <Upload
                                        fileList={this.state.fileList}
                                        disabled={this.state.disableUpload}
                                        accept=".png, .jpg, .jpeg, .webp"
                                        action={window.ipAddress + "/v1/profile/upload"}
                                        maxCount={1}
                                        onChange={(file) => {
                                            this.setState({ fileList: file.fileList })
                                            if (file.file.status === "uploading") {
                                                this.setState({ disableUpload: true })
                                            }
                                            else if ("response" in file.file) {
                                                if (file.file.response.success) {
                                                    message.success("Uploaded profile picture")
                                                    message.success("Reload the page to see your shiny new picture :)!")
                                                }
                                                else {
                                                    message.error("Failed to upload profile picture")
                                                    if (file.file.response.error === "too-large") {
                                                        message.info("Please upload a file smaller than " + file.file.response.size.toString() + " Bytes.")
                                                    }
                                                }
                                                this.setState({ fileList: [], disableUpload: false })
                                            }
                                        }}
                                        headers={{ "Authorization": window.IRSCTFToken }}
                                        name="profile_pic"
                                        beforeUpload={file => {
                                            const exts = ["image/png", "image/jpg", "image/jpeg", "image/webp"]
                                            if (!exts.includes(file.type)) {
                                                message.error(`${file.name} is not an image file.`);
                                                return Upload.LIST_IGNORE
                                            }
                                            return true
                                        }}>
                                        <Tooltip title={<span>Upload a custom profile picture.</span>}>
                                            <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
                                        </Tooltip>
                                    </Upload>
                                    <Tooltip title={<span>Reset your profile picture to the default profile picture.</span>}>
                                        <Button danger type="primary" icon={<DeleteOutlined />} style={{ marginLeft: "1ch" }} onClick={() => { this.deleteProfilePic() }} />
                                    </Tooltip>
                                </div>
                            </div>
                            <h1 style={{ fontSize: "5ch", marginLeft: "1ch" }}>{this.props.username}</h1>
                        </div>

                    </div>
                )}
            </Layout>
        )
    }
}




export default Settings;
