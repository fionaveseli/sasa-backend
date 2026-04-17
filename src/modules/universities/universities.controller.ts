export const getUniversitiesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const universities = await getAllUniversities();

    return res.status(200).json({
      universities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch universities",
    });
  }
};

export const createUniversityController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      universityName,
      universityAddress,
      contactNumber,
      logo,
      bannerColor,
      bio,
    } = req.body;

    if (!universityName) {
      return res.status(400).json({
        message: "University name is required",
      });
    }

    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await createUniversity(
      {
        universityName,
        universityAddress,
        contactNumber,
        logo,
        bannerColor,
        bio,
      },
      req.user.userId
    );

    const { password, ...safeUser } = result.updatedUser;

    return res.status(201).json({
      university: result.university,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to create university";

    return res.status(400).json({ message });
  }
};