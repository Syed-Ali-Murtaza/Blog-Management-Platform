import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill

function AddPost() {
    const [post, setCreatePost] = useState({ image: "", title: "", description: "", category: "", tags: "", status: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();

    const fetchCategory = async () => {
        try {
            const response = await apiInstance.get(`post/category/list/`);
            setCategoryList(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleCreatePostChange = (event) => {
        setCreatePost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    const handleEditorChange = (value) => {
        setCreatePost({
            ...post,
            description: value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        if (selectedFile) {
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setCreatePost({
                    ...post,
                    image: {
                        file: selectedFile,
                        preview: reader.result,
                    },
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!post.title || !post.description || !post.image.file) {
            Toast("error", "All Fields Are Required To Create A Post");
            setIsLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("user_id", userId);
        formdata.append("title", post.title);
        formdata.append("image", post.image.file);
        formdata.append("description", post.description);
        formdata.append("tags", post.tags);
        formdata.append("category", post.category);
        formdata.append("post_status", post.status);

        try {
            const response = await apiInstance.post("author/dashboard/post-create/", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            Swal.fire({
                icon: "success",
                title: "Post created successfully.",
            });
            navigate("/posts/");
        } catch (error) {
            console.error("Error creating post:", error);
            Toast("error", "Failed to create post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <>
                                <section className="py-4 py-lg-6 bg-primary rounded-3">
                                    <div className="container">
                                        <div className="row">
                                            <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                                <div className="d-lg-flex align-items-center justify-content-between">
                                                    <div className="mb-4 mb-lg-0">
                                                        <h1 className="text-white mb-1">Create Blog Post</h1>
                                                        <p className="mb-0 text-white lead">Use the article builder below to write your article.</p>
                                                    </div>
                                                    <div>
                                                        <Link to="/instructor/posts/" className="btn" style={{ backgroundColor: "white" }}>
                                                            <i className="fas fa-arrow-left"></i> Back to Posts
                                                        </Link>
                                                        <button type="button" className="btn btn-dark ms-2" onClick={() => navigate("/instructor/posts/")}>
                                                            Save Changes <i className="fas fa-check-circle"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <form onSubmit={handleCreatePost} className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Basic Information</h4>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="postThumbnail" className="form-label">
                                                Preview
                                            </label>
                                            <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"} alt="" />
                                            <div className="mb-3">
                                                <label htmlFor="postThumbnail" className="form-label">
                                                    Thumbnail
                                                </label>
                                                <input onChange={handleFileChange} name="image" id="postThumbnail" className="form-control" type="file" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input onChange={handleCreatePostChange} name="title" className="form-control" type="text" placeholder="" />
                                                <small>Write a 60 character post title.</small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Post Category</label>
                                                <select name="category" onChange={handleCreatePostChange} className="form-select">
                                                    <option value="">-------------</option>
                                                    {categoryList?.map((c, index) => (
                                                        <option key={index} value={c?.id}>{c?.title}</option>
                                                    ))}
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Post Description</label>
                                                <ReactQuill
                                                    value={post.description}
                                                    onChange={handleEditorChange}
                                                    theme="snow"
                                                />
                                                <small>A brief summary of your post.</small>
                                            </div>
                                            <label className="form-label">Tags</label>
                                            <input onChange={handleCreatePostChange} name="tags" className="form-control" type="text" placeholder="health, medicine, fitness" />

                                            <div className="mb-3">
                                                <label className="form-label">Status</label>
                                                <select onChange={handleCreatePostChange} name="status" className="form-select">
                                                    <option value="Active">Active</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Disabled">Disabled</option>
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>
                                        </div>
                                    </div>
                                    {isLoading ? (
                                        <button className="btn btn-lg btn-secondary w-100 mt-2" disabled>
                                            Creating Post... <i className="fas fa-spinner fa-spin"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Create Post <i className="fas fa-check-circle"></i>
                                        </button>
                                    )}
                                </form>
                            </>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default AddPost;
