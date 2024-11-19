import { IInputs, IOutputs } from "./generated/ManifestTypes";
import axios from 'axios';

export class mypcf01 implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;
    private _data: string;
    private _printable: string;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;
        this._printable = context.parameters.sampleProperty.raw as string;

        this.fetchData();
    }

    // Function to make an API request
    async fetchData() {
        try {
            const response = await axios.get('http://localhost:3000/api', {
                headers: {
                'Content-Type': 'application/json'
                }
            });
            this._data = response.data.message;
            this.render();
            console.log('Data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to make an API request for printing text
    public handlePrint() {
        axios.post(`http://localhost:3000/print`, { "text": this._printable })
          .then(function (response) {
            console.log('Print Status:', response.data.status)
          })
          .catch(function (error) {
            console.error('Error printing data:', error)
          });
      }
      
    private render(): void {
        this._container.innerHTML = `<div>${this._data}</div>`;
    }
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
        this._printable = context.parameters.sampleProperty.raw as string;
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
