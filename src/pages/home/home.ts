import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { AlertController } from "ionic-angular";

import { GroceriesServiceProvider } from "../../providers/groceries-service/groceries-service";
import { InputDialogueServiceProvider } from "../../providers/input-dialogue-service/input-dialogue-service";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  title = "Grocery List";

  items = [];
  errorMessage: string;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dataService: GroceriesServiceProvider,
    public inputDialogueService: InputDialogueServiceProvider,
    public socialSharing: SocialSharing
  ) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems().subscribe(
      (items) => (this.items = items),
      (error) => (this.errorMessage = <any>error)
    );
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  shareItem(item, index) {
    console.log("Sharing item - ", item, index);
    const toast = this.toastCtrl.create({
      message: "Sharing Item - " + index + " ...",
      duration: 3000,
    });
    toast.present();

    let message =
      "Grocery Item - Name : " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";
    // Check if sharing via email is supported
    this.socialSharing
      .share(message, subject)
      .then(() => {
        // Sharing via email is possible
        console.log("Shared successfully");
      })
      .catch((error) => {
        // Sharing via email is not possible
        console.error("Error while sharing ", error);
      });
  }
  editItem(item, index) {
    console.log("Editing item - ", item, index);
    const toast = this.toastCtrl.create({
      message: "Editing Item - " + index + " ...",
      duration: 3000,
    });
    toast.present();
    this.inputDialogueService.showPrompt(item, index);
  }
  addItem() {
    console.log("adding item");
    this.inputDialogueService.showPrompt();
  }
}
