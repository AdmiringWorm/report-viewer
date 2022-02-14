import { applyBindings } from "knockout";
import MainViewModel from "./viewModels/main-viewmodel";

var viewModel = new MainViewModel();
applyBindings(viewModel, document.getElementById("htmlDocument"));
viewModel.isLoading(false);