import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchemaValidation } from "../Validations/CompanyValidation";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/CompanyRegister.css";
import companyImg from "../Images/company-man.png"; // ضع هنا صورة الرجل اللي يستخدم اللابتوب

const INDUSTRIES = [
  "",
  "Technology",
  "Hospitality / Coffee Shops",
  "Retail / Store",
  "Education",
  "Logistics",
  "Government",
  "Other",
];

const LOCATIONS = ["", "Salalah", "Taqah", "Mirbat", "Mughsail", "Other"];

const CompanyRegister = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companySchemaValidation),
  });

  const onSubmit = (data) => {
    localStorage.setItem("companyData", JSON.stringify(data));
    alert("Company Registered ✅");
    navigate("/company-profile");
  };

  return (
    <div className="company-container">
      <div className="company-box">
        {/* LEFT SIDE (Form) */}
        <div className="company-card">
          <h1 className="company-title">
            Create your <span className="accent">account</span>
          </h1>
          <p className="company-sub">Please fill in your company details</p>

          <div className="role-switch">
            <Link to="/user-register" className="role-btn">
              Student
            </Link>
            <Link to="/company-register" className="role-btn active">
              Company
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Dhofar Advertising Co."
              {...register("companyName")}
            />
            <p className="error">{errors.companyName?.message}</p>

            <div className="row-flex">
              <div className="col-half">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="hr@company.com"
                  {...register("email")}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="col-half">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  {...register("password")}
                />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>

            <div className="row-flex">
              <div className="col-half">
                <label>Industry Type</label>
                <select {...register("industry")}>
                  {INDUSTRIES.map((i, idx) => (
                    <option key={idx} value={i}>
                      {i === "" ? "Select your industry" : i}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.industry?.message}</p>
              </div>

              <div className="col-half">
                <label>Location</label>
                <select {...register("location")}>
                  {LOCATIONS.map((l, idx) => (
                    <option key={idx} value={l}>
                      {l === "" ? "Select your location" : l}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.location?.message}</p>
              </div>
            </div>

            <label>Founded Date</label>
            <input type="date" {...register("foundedDate")} />
            <p className="error">{errors.foundedDate?.message}</p>

            <button type="submit" className="company-btn">
              Sign up
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Log in now!
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE (Image) */}
        <div className="company-image">
          <img src={companyImg} alt="Omani businessman using laptop" />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
