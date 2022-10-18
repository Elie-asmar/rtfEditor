import 'devextreme/dist/css/dx.light.css';
import 'devexpress-richedit/dist/dx.richedit.css';
import React from 'react';
import {
    create, createOptions, RichEdit, ViewType, RichEditUnit,
    DocumentFormat, RibbonTabType, FileTabItemId, HomeTabItemId,
} from 'devexpress-richedit';
import axios from 'axios';
const DB_LINK = 'http://183.183.183.122/CtsWebService_LabRad/DataService.svc/web/'
class RichEditComponent extends React.Component {

    constructor(props) {
        super(props)
        this.rich = RichEdit;
        this.created = false


    }

    componentDidMount() {

        // the createOptions() method creates an object that contains RichEdit options initialized with default values
        const options = createOptions();

        let FilesTab = options.ribbon.getTab(RibbonTabType.File);
        options.ribbon.removeTab(FilesTab)
        // FilesTab.removeItem(FileTabItemId.OpenDocument)
        // FilesTab.removeItem(FileTabItemId.CreateNewDocument)
        // FilesTab.removeItem(FileTabItemId.ExportDocument)
        // FilesTab.removeItem(FileTabItemId.Download)
        let ViewTab = options.ribbon.getTab(RibbonTabType.View);
        options.ribbon.removeTab(ViewTab);
        let PageLayoutTab = options.ribbon.getTab(RibbonTabType.PageLayout);
        options.ribbon.removeTab(PageLayoutTab);
        let ReferencesTab = options.ribbon.getTab(RibbonTabType.References);
        options.ribbon.removeTab(ReferencesTab);
        let MailTab = options.ribbon.getTab(RibbonTabType.MailMerge);
        options.ribbon.removeTab(MailTab);





        options.bookmarks.visibility = true;
        options.bookmarks.color = '#ff0000';

        options.confirmOnLosingChanges.enabled = true;
        options.confirmOnLosingChanges.message = 'Are you sure you want to perform the action? All unsaved document data will be lost.';

        options.fields.updateFieldsBeforePrint = true;
        options.fields.updateFieldsOnPaste = true;

        options.mailMerge.activeRecord = 2;
        options.mailMerge.viewMergedData = true;
        options.mailMerge.dataSource = [
            { Name: 'Indy', age: 32 },
            { Name: 'Andy', age: 28 },
        ];

        // events
        options.events.activeSubDocumentChanged = () => { };
        options.events.autoCorrect = () => { };
        options.events.calculateDocumentVariable = () => { };
        options.events.characterPropertiesChanged = () => { };
        options.events.contentInserted = () => { };
        options.events.contentRemoved = () => { };
        options.events.documentChanged = () => { };
        options.events.documentFormatted = () => { };
        options.events.documentLoaded = () => { };
        options.events.gotFocus = () => { };
        options.events.hyperlinkClick = () => { };
        options.events.keyDown = () => { };
        options.events.keyUp = () => { };
        options.events.paragraphPropertiesChanged = () => { };
        options.events.lostFocus = () => { };
        options.events.pointerDown = () => { };
        options.events.pointerUp = () => { };
        options.events.saving = (s, e) => {
            e.handled = true;
            console.log(s)
            console.log(e)
            console.log(e.base64);
            console.log(e.fileName);
            //DocumentFormat.OpenXml
            //DocumentFormat.PlainText
            //DocumentFormat.Rtf
            console.log(e.format); //in DocumentFormat
            let _data = {
                centerid: '1',
                resultid: '5',
                resyear: '2022',
                payload: e.base64
            };

            axios({
                method: "post",
                url: `${DB_LINK}SaveRadResultRtf`,
                data: JSON.stringify(_data),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
            })
                .then(response => {



                })
                .catch(error => {

                });


        };
        options.events.saved = (s, e) => {
            e.handled = true;
            console.log(s)
            console.log(e)
            console.log(e.base64);
            console.log(e.fileName);
            //DocumentFormat.OpenXml
            //DocumentFormat.PlainText
            //DocumentFormat.Rtf
            console.log(e.format); //in DocumentFormat
        };
        options.events.selectionChanged = () => { };
        options.events.customCommandExecuted = (s, e) => {
            switch (e.commandName) {
                case 'insertEmailSignature':
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, '_________');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'Best regards,');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'John Smith');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, 'john@example.com');
                    s.document.insertParagraph(s.document.length);
                    s.document.insertText(s.document.length, '+1 (818) 844-0000');
                    break;
            }
        };

        options.unit = RichEditUnit.Inch;

        options.view.viewType = ViewType.PrintLayout;
        options.view.simpleViewSettings.paddings = {
            left: 15,
            top: 15,
            right: 15,
            bottom: 15,
        };
        options.exportUrl = 'https://siteurl.com/api/';

        options.readOnly = false;
        options.width = '1400px';
        options.height = '400px';
        options.authentication = "1234"

        if (!this.created) {
            this.rich = create(document.getElementById("richEdit"), options);
            this.created = true
        }

    }

    render() {
        return (
            <>
                <button onClick={() => {
                    axios({
                        method: "get",
                        url: `${DB_LINK}GetRadResultRtf?centerid=1&resultid=5&resyear=2022`,
                        headers: {
                            Accept: "application/json",
                        },
                    })
                        .then(response => {

                            this.rich.openDocument(response.data, 'DocumentName', DocumentFormat.Rtf);
                            console.log(this.rich.document)

                        })
                        .catch(error => {

                        });

                }}>Get Data</button>
                <button onClick={() => {
                    this.rich.saveDocument(DocumentFormat.Rtf)



                }}>Save Data</button>
                <div id="richEdit"></div>
            </>

        );
    }
}

export { RichEditComponent }