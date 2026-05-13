export const ContentLayout = ({ children }) => {
  return (
    <div className="container mt-5 ms-3 me-3 mb-3 ml-5">
      <h3 className="d-flex justify-content-center"></h3>
      <br />
      <div className="row d-flex justify-content-center">
        <div className="col-md-12">{children}</div>
      </div>
    </div>
  );
};
