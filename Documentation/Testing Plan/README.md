# Testing Plan

## Overview

This document details the comprehensive testing strategy for a software development project undertaken in collaboration with Axis for the TDDC88 Software Engineering Theory and Practice course at Linköping University. It outlines various testing methodologies, including unit, system, user experience, and acceptance testing, and emphasizes automated testing using a Git pipeline. The plan also addresses potential risks and mitigation strategies, ensuring a robust and user-centric final product.

## Changelog

### Version 3.0 - 2024-11-07

Owner: Testing Group

_This version refines the Unit and System testing sections, adds details about automated vs. manual testing, introduces E2E testing, clarifies in-scope/out-of-scope elements, and expands the risk assessment._

#### Added

- Details on the tools and workflow for unit testing, including the use of pytest and cunit.
- Explanation of automated vs. manual testing in Unit Testing.
- E2E testing explanation within System Testing.
- Clarification of in-scope items related to qualitative usability and different testing levels.
- Risk assessment entries for insufficient time for system and UX testing, and communication issues with developers.
- Document owner name in Author field.

#### Changed

- Wording and explanations in the Introduction, In Scope, and Out of Scope sections for clarity.
- Workflow explanation in Test Process to include environment setup details.
- Workflow for bug resolution to include actions if a bug cannot be resolved.
- Unit Testing section to specify the code sections (LAN, External, ACAP, Client) and their respective testing approaches.
- Iteration details in Time Plan for clarity and completeness.
- Removed Option 3 from the Acceptance Test execution plan.
- Added quantifiable risk factors (Probability, Impact, Risk Factor) to each risk assessment entry.

### Version 2.1 - 2024-10-18

Owner: Testing Group

_This version clarifies testing processes, expands on traceability, details the system testing approach, and incorporates risk assessment relating to limited time and automated testing knowledge._

#### Changed

- Expanded the Workflow section in Test Process to provide a clearer step-by-step overview.
- Added detailed information about Requirement-to-Test Traceability and the Test Traceability Matrix in the Traceability section.
- Included a description of functional and non-functional testing within the System Testing section.
- Updated Risk Assessment with specific risks related to limited time in Study Period 1 and the need to gain technical knowledge for automated testing, along with proposed mitigation strategies.

### Version 2.0 - 2024-10-10

Owner: Testing Group

_This version significantly expands the Testing Plan to include a detailed bug handling process and a refined time plan with specific iteration details._

#### Added

- Bug Handling Process section, outlining tool selection, reporting procedures, workflows, metrics, and continuous improvement integration. [Development Team]
- Detailed breakdown of each iteration in the Time Plan, including durations, focus areas, and acceptance test scheduling.
- Special Considerations in the Time Plan, addressing the post-exam push for testing activities.
- Section for Testing External Libraries. [Supervisor Martin]

#### Changed

- Time plan structure to incorporate iteration details.

### Version 1.0 - 2024-10-04

Owner: Testing Group

_This version establishes the initial structure and content of the Testing Plan._

#### Added

- Introduction with In Scope and Out of Scope sections.
- Test Process outlining workflow, bug handling, and traceability.
- Sections for Unit Testing, System Testing, User Experience Test, and Acceptance Test.
- Time plan and Risk Assessment sections.
