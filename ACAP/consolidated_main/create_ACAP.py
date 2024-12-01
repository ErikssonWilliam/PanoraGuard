import subprocess
import os
import shutil

# Define constants
IMAGE_NAME = "main"
SOURCE_PATH = "/opt/app"
DESTINATION_PATH = "./build"


def is_docker_running():
    """
    Check if Docker is running by executing 'docker info'.
    """
    try:
        subprocess.run(
            ["docker", "info"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
        return True
    except subprocess.CalledProcessError:
        raise RuntimeError(
            "Docker is not running. Please start Docker Desktop and try again."
        )


def run_command(command):
    """
    Run a shell command and return the output or error.
    """
    try:
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error running command: {' '.join(command)}\n{e.stderr}")


def delete_folder_if_exists(folder_path):
    """
    Delete the folder if it exists.
    """
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        shutil.rmtree(folder_path)


def build_docker_image():
    """
    Build the Docker image.
    """
    run_command(["docker", "build", "--tag", IMAGE_NAME, "."])


def create_docker_container():
    """
    Create a Docker container and return its ID.
    """
    container_id = run_command(["docker", "create", IMAGE_NAME])
    if not container_id:
        raise RuntimeError("Failed to create Docker container.")
    return container_id


def copy_files_from_container(container_id):
    """
    Copy files from the container to the destination folder.
    """
    run_command(["docker", "cp", f"{container_id}:{SOURCE_PATH}", DESTINATION_PATH])
    if not os.path.exists(DESTINATION_PATH):
        raise RuntimeError("Failed to copy files.")


def main():
    """
    Main execution flow.
    """
    try:
        # Ensure Docker is running
        is_docker_running()

        # Ensure the build folder is clean
        delete_folder_if_exists(DESTINATION_PATH)

        # Build the Docker image
        build_docker_image()

        # Create the Docker container
        container_id = create_docker_container()

        # Copy files from the container
        copy_files_from_container(container_id)

        # Print success message
        print("ACAP created successfully to: " + DESTINATION_PATH)

    except RuntimeError as e:
        print(f"Error: {e}")
        return


if __name__ == "__main__":
    main()
