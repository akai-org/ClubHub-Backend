const UserRepository = require('./userRepository')
const ScienceClubRepository = require('./scienceClubRepository')
const ProjectRepository = require('./projectRepository')

const connectDB = require('../../setup/DB_setup')

const userRepo = new UserRepository()
const scienceClubRepo = new ScienceClubRepository()
const projectRepo = new ProjectRepository()

module.exports = {
    connect : connectDB,
    userRepo,
    scienceClubRepo,
    projectRepo
}