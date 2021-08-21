import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import CategoryModal from "../components/CategoryModal";
import { GlobalState } from "../GlobalState";

function Category() {
  const state = useContext(GlobalState);
  const [categories] = state.categoryAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoryAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState("");

  const handleSubmit = async () => {
    if (onEdit) {
      try {
        await axios.put(
          `/api/category/${id}`,
          {
            name: category,
          },
          {
            headers: { Authorization: token },
          }
        );
        toast.warn("Category Updated");
        setCallback(!callback);
        setCategory("");
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    } else {
      try {
        await axios.post(
          "/api/category",
          {
            name: category,
          },
          {
            headers: { Authorization: token },
          }
        );
        toast.success("Category Created");
        setCallback(!callback);
        setCategory("");
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    }
  };

  const editCategory = (id, name) => {
    setId(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id, name) => {
    if (window.confirm(`Want to delete ${name} Category`)) {
      await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      setCallback(!callback);
      toast.error("Category Deleted");
    }
  };

  return (
    <div className="container">
      <div className="row my-3">
        <div className="col-lg-10">
          <h3 className="my-2">Categories</h3>
        </div>
        <div className="col-lg-2">
          <button
            className="btn btn-success w-100 my-2 p-2 text-uppercase"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="fas fa-plus mx-1"></i> add category
          </button>
        </div>
      </div>
      <CategoryModal
        setCategory={setCategory}
        category={category}
        handleSubmit={handleSubmit}
        setOnEdit={setOnEdit}
      />
      <div className="table-responsive mb-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>_id</th>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.map((category) => (
                <tr>
                  <td>{category._id}</td>
                  <th scope="row">{category.name}</th>
                  <td className="d-flex py-3">
                    <i
                      className="fas fa-edit mx-1"
                      onClick={() => {
                        editCategory(category._id, category.name);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    ></i>{" "}
                    <i
                      className="fas fa-minus-circle mx-1"
                      onClick={() => {
                        deleteCategory(category._id, category.name);
                      }}
                    ></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;